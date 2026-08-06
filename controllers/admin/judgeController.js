
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
import { User, Event, Score } from "../../models/relationships.js";
import bcrypt from "bcrypt";
import { logActivity } from "../../middleware/activityLogger.js";

export const listJudges = async (req, res) => {
  try {
    const judges = await User.findAll({
      where: { role: 'judge' },
      include: [{ model: Event, as: 'assignedEvents' }],
      order: [['createdAt', 'DESC']]
    });
    res.render("admin/judges/list", { title: "Judges", user: req.user, judges });
  } catch (error) {
    console.error(error);
    req.flash("error_msg", "Error loading judges");
    res.redirect("/admin/dashboard");
  }
};

export const createJudgePage = (req, res) => {
  res.render("admin/judges/create", { title: "Add Judge", user: req.user });
};

export const createJudge = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const normalizedEmail = (email || "").trim().toLowerCase();

    const existingUser = await User.findOne({ where: { email: normalizedEmail } });
    if (existingUser) {
      req.flash("error_msg", "Email already exists");
      return res.redirect("/admin/judges");
    }

    const hashed = await bcrypt.hash(password, 10);
    const judge = await User.create({
      name: (name || "Judge").trim(),
      email: normalizedEmail,
      password: hashed,
      role: 'judge',
      isActive: true
    });

    await logActivity("CREATE_JUDGE", `Judge created: ${judge.name}`, req.user.id);
    req.flash("success_msg", "Judge created successfully");
    res.redirect("/admin/judges");
  } catch (error) {
    console.error("Judge creation failed:", error);
    req.flash("error_msg", "Error creating judge");
    res.redirect("/admin/judges");
  }
};

export const assignJudgeToEvent = async (req, res) => {
  try {
    const { judgeId, eventId } = req.body;
    const judge = await User.findByPk(judgeId);
    const event = await Event.findByPk(eventId);
    if (!judge || !event) {
      req.flash("error_msg", "Judge or Event not found");
      return res.redirect("/admin/judges");
    }
    await event.addJudge(judge);
    await logActivity("ASSIGN_JUDGE", `Judge ${judge.name} assigned to event ${event.name}`, req.user.id, event.id);
    req.flash("success_msg", "Judge assigned successfully");
    res.redirect("/admin/judges");
  } catch (error) {
    req.flash("error_msg", "Error assigning judge");
    res.redirect("/admin/judges");
  }
};

export const assignJudgeToAllEvents = async (req, res) => {
  try {
    const { judgeId } = req.body;
    const judge = await User.findByPk(judgeId);
    if (!judge) {
      req.flash("error_msg", "Judge not found");
      return res.redirect("/admin/judges");
    }
    const events = await Event.findAll();
    for (const event of events) {
      await event.addJudge(judge);
      await logActivity("ASSIGN_JUDGE", `Judge ${judge.name} assigned to event ${event.name}`, req.user.id, event.id);
    }
    req.flash("success_msg", "Judge assigned to all events successfully");
    res.redirect("/admin/judges");
  } catch (error) {
    req.flash("error_msg", "Error assigning judge to all events");
    res.redirect("/admin/judges");
  }
};

export const removeJudgeFromEvent = async (req, res) => {
  try {
    const { judgeId, eventId } = req.params;
    const judge = await User.findByPk(judgeId);
    const event = await Event.findByPk(eventId);
    if (!judge || !event) {
      req.flash("error_msg", "Judge or Event not found");
      return res.redirect("/admin/events");
    }
    await event.removeJudge(judge);
    await logActivity("REMOVE_JUDGE", `Judge ${judge.name} removed from event ${event.name}`, req.user.id, event.id);
    req.flash("success_msg", "Judge removed successfully");
    res.redirect(`/admin/events/${eventId}`);
  } catch (error) {
    req.flash("error_msg", "Error removing judge");
    res.redirect("/admin/events");
  }
};

export const deleteJudge = async (req, res) => {
  try {
    const judge = await User.findByPk(req.params.id);
    if (!judge || judge.role !== 'judge') {
      req.flash("error_msg", "Judge not found");
      return res.redirect("/admin/judges");
    }
    await logActivity("DELETE_JUDGE", `Judge deleted: ${judge.name}`, req.user.id);
    await judge.destroy();
    req.flash("success_msg", "Judge deleted successfully");
    res.redirect("/admin/judges");
  } catch (error) {
    req.flash("error_msg", "Error deleting judge");
    res.redirect("/admin/judges");
  }
};
