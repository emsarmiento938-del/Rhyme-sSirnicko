
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
import { Criteria, Round, Event } from "../../models/relationships.js";
import { logActivity } from "../../middleware/activityLogger.js";

export const listCriteria = async (req, res) => {
  try {
    const round = await Round.findByPk(req.params.roundId, {
      include: [{ model: Event, as: 'event' }]
    });
    if (!round) {
      req.flash("error_msg", "Round not found");
      return res.redirect("/admin/events");
    }
    const criteria = await Criteria.findAll({
      where: { roundId: req.params.roundId },
      order: [['createdAt', 'ASC']]
    });
    res.render("admin/criteria/list", { title: "Criteria", user: req.user, round, criteria });
  } catch (error) {
    console.error(error);
    req.flash("error_msg", "Error loading criteria");
    res.redirect("/admin/events");
  }
};

export const createCriteriaPage = async (req, res) => {
  try {
    const round = await Round.findByPk(req.params.roundId);
    if (!round) {
      req.flash("error_msg", "Round not found");
      return res.redirect("/admin/events");
    }
    res.render("admin/criteria/create", { title: "Create Criteria", user: req.user, round });
  } catch (error) {
    console.error(error);
    req.flash("error_msg", "Error loading page");
    res.redirect("/admin/events");
  }
};

export const createCriteria = async (req, res) => {
  try {
    const { name, description, weight, maxScore } = req.body;
    const round = await Round.findByPk(req.params.roundId);
    if (!round) {
      req.flash("error_msg", "Round not found");
      return res.redirect("/admin/events");
    }
    const criteria = await Criteria.create({
      name,
      description,
      weight: parseFloat(weight),
      maxScore: parseFloat(maxScore) || 100,
      roundId: req.params.roundId
    });
    await logActivity("CREATE_CRITERIA", `Criteria created: ${criteria.name}`, req.user.id, round.eventId);
    req.flash("success_msg", "Criteria created successfully");
    res.redirect(`/admin/rounds/${req.params.roundId}/criteria`);
  } catch (error) {
    req.flash("error_msg", "Error creating criteria");
    res.redirect(`/admin/rounds/${req.params.roundId}/criteria`);
  }
};

export const updateCriteria = async (req, res) => {
  try {
    const { name, description, weight, maxScore } = req.body;
    const criteria = await Criteria.findByPk(req.params.id, {
      include: [{ model: Round, as: 'round' }]
    });
    if (!criteria) {
      req.flash("error_msg", "Criteria not found");
      return res.redirect("/admin/events");
    }
    await criteria.update({
      name,
      description,
      weight: parseFloat(weight),
      maxScore: parseFloat(maxScore)
    });
    await logActivity("UPDATE_CRITERIA", `Criteria updated: ${criteria.name}`, req.user.id, criteria.round.eventId);
    req.flash("success_msg", "Criteria updated successfully");
    res.redirect(`/admin/rounds/${criteria.roundId}/criteria`);
  } catch (error) {
    req.flash("error_msg", "Error updating criteria");
    res.redirect("/admin/events");
  }
};

export const deleteCriteria = async (req, res) => {
  try {
    const criteria = await Criteria.findByPk(req.params.id, {
      include: [{ model: Round, as: 'round' }]
    });
    if (!criteria) {
      req.flash("error_msg", "Criteria not found");
      return res.redirect("/admin/events");
    }
    const roundId = criteria.roundId;
    await logActivity("DELETE_CRITERIA", `Criteria deleted: ${criteria.name}`, req.user.id, criteria.round.eventId);
    await criteria.destroy();
    req.flash("success_msg", "Criteria deleted successfully");
    res.redirect(`/admin/rounds/${roundId}/criteria`);
  } catch (error) {
    req.flash("error_msg", "Error deleting criteria");
    res.redirect("/admin/events");
  }
};
