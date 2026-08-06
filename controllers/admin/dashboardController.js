
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
import { Event, Round, Participant, User, Criteria, Score } from "../../models/relationships.js";
import { Op } from "sequelize";

export const adminDashboard = async (req, res) => {
  try {
    const [totalEvents, totalParticipants, totalJudges, totalCriteria, ongoingEvents, upcomingEvents, recentEvents] = await Promise.all([
      Event.count(),
      Participant.count(),
      User.count({ where: { role: 'judge' } }),
      Criteria.count(),
      Event.count({ where: { status: 'ongoing' } }),
      Event.count({ where: { status: 'upcoming' } }),
      Event.findAll({
        order: [['createdAt', 'DESC']],
        limit: 5,
        include: [{ model: Round, as: 'rounds' }]
      })
    ]);

    const formattedEvents = recentEvents.map(event => ({
      ...event.toJSON(),
      date: event.date ? new Date(event.date).toLocaleString() : ''
    }));

    res.render("admin/dashboard", {
      title: "Admin Dashboard",
      user: req.user,
      totalEvents,
      totalParticipants,
      totalJudges,
      totalCriteria,
      ongoingEvents,
      upcomingEvents,
      recentEvents: formattedEvents
    });
  } catch (error) {
    console.error("Admin dashboard load failed:", error);
    req.flash("error_msg", "Error loading dashboard");
    res.redirect("/login");
  }
};
