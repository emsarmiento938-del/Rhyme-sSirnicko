
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
import { Round, Participant, Criteria, Score, Event, User } from "../../models/relationships.js";
import { Op } from "sequelize";
import { logActivity } from "../../middleware/activityLogger.js";

export const scoringPanel = async (req, res) => {
  try {
    const round = await Round.findByPk(req.params.roundId, {
      include: [
        { model: Event, as: 'event' },
        { model: Participant, as: 'participants' },
        { model: Criteria, as: 'criteria' }
      ]
    });

    if (!round) {
      req.flash("error_msg", "Round not found");
      return res.redirect("/judge/dashboard");
    }

    // Check if judge is assigned to this event
    const judge = await User.findByPk(req.user.id, {
      include: [{ model: Event, as: 'assignedEvents' }]
    });
    const isAssigned = judge.assignedEvents.some(e => e.id === round.eventId);
    if (!isAssigned) {
      req.flash("error_msg", "You are not assigned to this event");
      return res.redirect("/judge/dashboard");
    }

    if (round.status !== 'open') {
      req.flash("error_msg", "This round is not open for scoring");
      return res.redirect("/judge/dashboard");
    }

    // Get existing scores
    const existingScores = await Score.findAll({
      where: {
        roundId: round.id,
        judgeId: req.user.id
      }
    });

    const scoresMap = {};
    existingScores.forEach(score => {
      const key = `${score.participantId}_${score.criteriaId}`;
      scoresMap[key] = score;
    });

    res.render("judge/scoring", {
      title: "Scoring Panel",
      user: req.user,
      round,
      scoresMap
    });
  } catch (error) {
    console.error(error);
    req.flash("error_msg", "Error loading scoring panel");
    res.redirect("/judge/dashboard");
  }
};

export const submitScores = async (req, res) => {
  try {
    const { roundId } = req.params;
    const { scores } = req.body; // Format: { participantId_criteriaId: score }

    const round = await Round.findByPk(roundId, {
      include: [{ model: Criteria, as: 'criteria' }]
    });

    if (!round || round.status !== 'open') {
      req.flash("error_msg", "Round is not open for scoring");
      return res.redirect("/judge/dashboard");
    }

    // Determine weight normalization factor (some installs store weights as 0-1 fractions)
    const totalWeightRaw = round.criteria.reduce((s, c) => s + parseFloat(c.weight || 0), 0);
    const weightFactor = totalWeightRaw > 0 && totalWeightRaw <= 1.05 ? 100 : 1;

    // Process each score
    for (const [key, scoreValue] of Object.entries(scores)) {
      const [participantId, criteriaId] = key.split('_');
      const scoreNum = parseFloat(scoreValue);
      
      if (isNaN(scoreNum) || scoreNum < 0) continue;

      const criteria = round.criteria.find(c => c.id === parseInt(criteriaId));
      if (!criteria) continue;

      // Ensure score doesn't exceed maxScore
      const finalScore = Math.min(scoreNum, criteria.maxScore);
      const effectiveWeight = parseFloat(criteria.weight || 0) * weightFactor;
      const weightedScore = (finalScore / criteria.maxScore) * effectiveWeight;

      // Check if score already exists
      const existingScore = await Score.findOne({
        where: {
          participantId: parseInt(participantId),
          criteriaId: parseInt(criteriaId),
          judgeId: req.user.id,
          roundId: round.id
        }
      });

      if (existingScore) {
        await existingScore.update({
          score: finalScore,
          weightedScore,
          isSubmitted: true,
          submittedAt: new Date()
        });
      } else {
        await Score.create({
          participantId: parseInt(participantId),
          criteriaId: parseInt(criteriaId),
          judgeId: req.user.id,
          roundId: round.id,
          score: finalScore,
          weightedScore,
          isSubmitted: true,
          submittedAt: new Date()
        });
      }
    }

    await logActivity("SUBMIT_SCORES", `Scores submitted for round: ${round.name}`, req.user.id, round.eventId);
    req.flash("success_msg", "Scores submitted successfully");
    res.redirect("/judge/dashboard");
  } catch (error) {
    console.error(error);
    req.flash("error_msg", "Error submitting scores");
    res.redirect("/judge/dashboard");
  }
};
