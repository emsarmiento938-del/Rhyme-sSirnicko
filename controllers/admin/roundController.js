
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
import { Round, Event, Participant, Criteria } from "../../models/relationships.js";
import { logActivity } from "../../middleware/activityLogger.js";

export const listRounds = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.eventId);
    if (!event) {
      req.flash("error_msg", "Event not found");
      return res.redirect("/admin/events");
    }
    const rounds = await Round.findAll({
      where: { eventId: req.params.eventId },
      include: [
        { model: Criteria, as: 'criteria' },
        { model: Participant, as: 'participants' }
      ],
      order: [['order', 'ASC']]
    });
    res.render("admin/rounds/list", { title: "Rounds", user: req.user, event, rounds });
  } catch (error) {
    console.error(error);
    req.flash("error_msg", "Error loading rounds");
    res.redirect("/admin/events");
  }
};

export const createRoundPage = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.eventId);
    if (!event) {
      req.flash("error_msg", "Event not found");
      return res.redirect("/admin/events");
    }
    res.render("admin/rounds/create", { title: "Create Round", user: req.user, event });
  } catch (error) {
    console.error(error);
    req.flash("error_msg", "Error loading page");
    res.redirect("/admin/events");
  }
};

export const createRound = async (req, res) => {
  try {
    const { name, description, order, status } = req.body;
    const round = await Round.create({
      name,
      description,
      order: parseInt(order) || 1,
      status: status || 'pending',
      eventId: req.params.eventId
    });
    await logActivity("CREATE_ROUND", `Round created: ${round.name}`, req.user.id, req.params.eventId);
    req.flash("success_msg", "Round created successfully");
    res.redirect(`/admin/events/${req.params.eventId}/rounds`);
  } catch (error) {
    req.flash("error_msg", "Error creating round");
    res.redirect(`/admin/events/${req.params.eventId}/rounds`);
  }
};

export const updateRound = async (req, res) => {
  try {
    const { name, description, order, status } = req.body;
    const round = await Round.findByPk(req.params.id);
    if (!round) {
      req.flash("error_msg", "Round not found");
      return res.redirect("/admin/events");
    }
    await round.update({ name, description, order: parseInt(order), status });
    await logActivity("UPDATE_ROUND", `Round updated: ${round.name}`, req.user.id, round.eventId);
    req.flash("success_msg", "Round updated successfully");
    res.redirect(`/admin/events/${round.eventId}/rounds`);
  } catch (error) {
    req.flash("error_msg", "Error updating round");
    res.redirect("/admin/events");
  }
};

export const deleteRound = async (req, res) => {
  try {
    const round = await Round.findByPk(req.params.id);
    if (!round) {
      req.flash("error_msg", "Round not found");
      return res.redirect("/admin/events");
    }
    const eventId = round.eventId;
    await logActivity("DELETE_ROUND", `Round deleted: ${round.name}`, req.user.id, eventId);
    await round.destroy();
    req.flash("success_msg", "Round deleted successfully");
    res.redirect(`/admin/events/${eventId}/rounds`);
  } catch (error) {
    req.flash("error_msg", "Error deleting round");
    res.redirect("/admin/events");
  }
};

export const manageParticipantsPage = async (req, res) => {
  try {
    const round = await Round.findByPk(req.params.roundId, {
      include: [{ model: Event, as: 'event' }]
    });
    if (!round) {
      req.flash("error_msg", "Round not found");
      return res.redirect("/admin/events");
    }
    const allParticipants = await Participant.findAll({
      order: [['name', 'ASC']]
    });
    const assignedParticipants = await round.getParticipants();
    const assignedIds = assignedParticipants.map(p => p.id);
    res.render("admin/rounds/participants", {
      title: "Manage Participants",
      user: req.user,
      round,
      allParticipants,
      assignedIds
    });
  } catch (error) {
    console.error(error);
    req.flash("error_msg", "Error loading participants management page");
    res.redirect("/admin/events");
  }
};
