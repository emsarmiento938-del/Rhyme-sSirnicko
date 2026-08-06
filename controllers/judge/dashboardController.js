
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
import { User, Event, Round, Score } from "../../models/relationships.js";
import { Op } from "sequelize";

export const judgeDashboard = async (req, res) => {
  try {
    const judge = await User.findByPk(req.user.id, {
      include: [
        {
          model: Event,
          as: 'assignedEvents',
          include: [{ model: Round, as: 'rounds' }]
        }
      ]
    });

    const openRounds = await Round.findAll({
      where: { status: 'open' },
      include: [
        {
          model: Event,
          as: 'event',
          where: { id: { [Op.in]: judge.assignedEvents.map(e => e.id) } }
        }
      ]
    });

    const submittedScores = await Score.count({
      where: { judgeId: req.user.id, isSubmitted: true }
    });

    res.render("judge/dashboard", {
      title: "Judge Dashboard",
      user: req.user,
      judge,
      openRounds,
      submittedScores
    });
  } catch (error) {
    req.flash("error_msg", "Error loading dashboard");
    res.redirect("/login");
  }
};
