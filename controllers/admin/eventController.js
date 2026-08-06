
      /*
    MIT License
    
    Copyright (c) 2025 Christian I. Cabrera || XianFire Framework
    Mindoro State University - Philippines

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
    */
import { Event, Round, User, Participant } from "../../models/relationships.js";
import { logActivity } from "../../middleware/activityLogger.js";

export const listEvents = async (req, res) => {
  try {
    const events = await Event.findAll({
      include: [
        { model: Round, as: 'rounds' },
        { model: User, as: 'judges' }
      ],
      order: [['createdAt', 'DESC']]
    });
    
    const formattedEvents = events.map(event => ({
      ...event.toJSON(),
      date: new Date(event.date).toLocaleString()
    }));
    
    res.render("admin/events/list", { title: "Events", user: req.user, events: formattedEvents });
  } catch (error) {
    console.error(error);
    req.flash("error_msg", "Error loading events");
    res.redirect("/admin/dashboard");
  }
};

export const createEventPage = (req, res) => {
  res.render("admin/events/create", { title: "Create Event", user: req.user });
};

export const createEvent = async (req, res) => {
  try {
    const { name, description, date, venue, status, isPublic } = req.body;
    const event = await Event.create({
      name,
      description,
      date,
      venue,
      status: status || 'upcoming',
      isPublic: isPublic === 'on'
    });
    await logActivity("CREATE_EVENT", `Event created: ${event.name}`, req.user.id, event.id);
    req.flash("success_msg", "Event created successfully");
    res.redirect(`/admin/events/${event.id}`);
  } catch (error) {
    req.flash("error_msg", "Error creating event");
    res.redirect("/admin/events");
  }
};

export const viewEvent = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id, {
      include: [
        { model: Round, as: 'rounds', include: [{ model: Participant, as: 'participants' }] },
        { model: User, as: 'judges' }
      ]
    });
    if (!event) {
      req.flash("error_msg", "Event not found");
      return res.redirect("/admin/events");
    }
    const eventData = {
      ...event.toJSON(),
      date: new Date(event.date).toLocaleString()
    };
    res.render("admin/events/view", { title: event.name, user: req.user, event: eventData });
  } catch (error) {
    console.error(error);
    req.flash("error_msg", "Error loading event");
    res.redirect("/admin/events");
  }
};

export const editEventPage = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) {
      req.flash("error_msg", "Event not found");
      return res.redirect("/admin/events");
    }
    // Format date for datetime-local input
    const date = new Date(event.date);
    const formattedDate = date.toISOString().slice(0, 16);
    const eventData = {
      ...event.toJSON(),
      date: formattedDate
    };
    res.render("admin/events/edit", { title: "Edit Event", user: req.user, event: eventData });
  } catch (error) {
    console.error(error);
    req.flash("error_msg", "Error loading event");
    res.redirect("/admin/events");
  }
};

export const updateEvent = async (req, res) => {
  try {
    const { name, description, date, venue, status, isPublic } = req.body;
    const event = await Event.findByPk(req.params.id);
    if (!event) {
      req.flash("error_msg", "Event not found");
      return res.redirect("/admin/events");
    }
    await event.update({
      name,
      description,
      date,
      venue,
      status,
      isPublic: isPublic === 'on'
    });
    await logActivity("UPDATE_EVENT", `Event updated: ${event.name}`, req.user.id, event.id);
    req.flash("success_msg", "Event updated successfully");
    res.redirect(`/admin/events/${event.id}`);
  } catch (error) {
    req.flash("error_msg", "Error updating event");
    res.redirect("/admin/events");
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) {
      req.flash("error_msg", "Event not found");
      return res.redirect("/admin/events");
    }
    await logActivity("DELETE_EVENT", `Event deleted: ${event.name}`, req.user.id, event.id);
    await event.destroy();
    req.flash("success_msg", "Event deleted successfully");
    res.redirect("/admin/events");
  } catch (error) {
    req.flash("error_msg", "Error deleting event");
    res.redirect("/admin/events");
  }
};

export const archiveEvent = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) {
      req.flash("error_msg", "Event not found");
      return res.redirect("/admin/events");
    }
    await event.update({ status: 'archived' });
    await logActivity("ARCHIVE_EVENT", `Event archived: ${event.name}`, req.user.id, event.id);
    req.flash("success_msg", "Event archived successfully");
    res.redirect("/admin/events");
  } catch (error) {
    req.flash("error_msg", "Error archiving event");
    res.redirect("/admin/events");
  }
};
