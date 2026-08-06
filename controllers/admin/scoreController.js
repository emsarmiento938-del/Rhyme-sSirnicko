
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
import { Score, Round, Participant, Criteria, User, Event } from "../../models/relationships.js";
import { Op } from "sequelize";

export const viewScoreboard = async (req, res) => {
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
      return res.redirect("/admin/events");
    }

    // Calculate scores for each participant
    let participantIds = (round.participants || []).map(p => p.id);
    if (!participantIds.length && typeof round.getParticipants === 'function') {
      try {
        const assigned = await round.getParticipants();
        participantIds = (assigned || []).map(p => p.id);
      } catch (e) {
        console.error('Error fetching round participants via association', e);
      }
    }

    const participants = await Participant.findAll({
      where: { id: { [Op.in]: participantIds } },
      include: [
        {
          model: Score,
          as: 'scores',
          where: { roundId: round.id, isSubmitted: true },
          include: [
            { model: Criteria, as: 'criteria' },
            { model: User, as: 'judge' }
          ]
        }
      ]
    });

    // Calculate weighted averages
    const scoreboard = participants.map(participant => {
      const scoresByCriteria = {};
      participant.scores.forEach(score => {
        if (!scoresByCriteria[score.criteriaId]) {
          scoresByCriteria[score.criteriaId] = [];
        }
        scoresByCriteria[score.criteriaId].push(score);
      });

        let totalWeightedScore = 0;
        let totalWeight = 0;
        let totalRawScore = 0; // sum of average raw scores across criteria

        // Normalize weight units: if criteria weights sum to ~1, they are likely fractional (0-1).
        const totalWeightRaw = round.criteria.reduce((s, c) => s + parseFloat(c.weight || 0), 0);
        const weightFactor = totalWeightRaw > 0 && totalWeightRaw <= 1.05 ? 100 : 1;

        round.criteria.forEach(criteria => {
          const scores = scoresByCriteria[criteria.id] || [];
          const effectiveWeight = parseFloat(criteria.weight || 0) * weightFactor;
          if (scores.length > 0) {
            const avgScore = scores.reduce((sum, s) => sum + parseFloat(s.score), 0) / scores.length;
            const weightedScore = (avgScore / criteria.maxScore) * effectiveWeight;
            totalWeightedScore += weightedScore;
            // accumulate raw average (not weighted) for a points-style total
            totalRawScore += avgScore;
          }
          totalWeight += effectiveWeight;
        });

        const finalPercent = totalWeight > 0 ? (totalWeightedScore / totalWeight) * 100 : 0;

        return {
          participant,
          finalRaw: Number(totalRawScore.toFixed(2)),
          finalScorePercent: Number(finalPercent.toFixed(2)),
          scoresByCriteria,
          hasScores: (participant.scores && participant.scores.length > 0)
        };
    }).sort((a, b) => parseFloat(b.finalScore) - parseFloat(a.finalScore));

    res.render("admin/scores/scoreboard", {
      title: "Scoreboard",
      user: req.user,
      round,
      scoreboard
    });
  } catch (error) {
    console.error(error);
    req.flash("error_msg", "Error loading scoreboard");
    res.redirect("/admin/events");
  }
};

// Redirect to the most recent round's scoreboard (convenience for /admin/score)
export const latestScoreboardRedirect = async (req, res) => {
  try {
    const latestRound = await Round.findOne({ order: [['createdAt', 'DESC']] });
    if (!latestRound) {
      req.flash('error_msg', 'No rounds available yet.');
      return res.redirect('/admin/events');
    }
    return res.redirect(`/admin/rounds/${latestRound.id}/scoreboard`);
  } catch (err) {
    console.error('Error redirecting to latest scoreboard', err);
    req.flash('error_msg', 'Unable to open scoreboard');
    return res.redirect('/admin/events');
  }
};

// Redirect to the most recent round's printable results page
export const latestResultsPrintRedirect = async (req, res) => {
  try {
    const latestRound = await Round.findOne({ order: [['createdAt', 'DESC']] });
    if (!latestRound) {
      req.flash('error_msg', 'No rounds available yet.');
      return res.redirect('/admin/events');
    }
    return res.redirect(`/admin/result/print/${latestRound.id}`);
  } catch (err) {
    console.error('Error redirecting to latest printable results', err);
    req.flash('error_msg', 'Unable to open results');
    return res.redirect('/admin/events');
  }
};

// Results page: show top ranks for a round (default latest)
export const viewResults = async (req, res) => {
  try {
    let roundId = req.query.roundId;
    let round;
    if (roundId) {
      round = await Round.findByPk(roundId, { include: [{ model: Event, as: 'event' }, { model: Participant, as: 'participants' }, { model: Criteria, as: 'criteria' }] });
    } else {
      round = await Round.findOne({ order: [['createdAt', 'DESC']], include: [{ model: Event, as: 'event' }, { model: Participant, as: 'participants' }, { model: Criteria, as: 'criteria' }] });
    }

    if (!round) {
      req.flash('error_msg', 'No rounds available.');
      return res.redirect('/admin/events');
    }

    // Reuse scoreboard aggregation logic from viewScoreboard
    let participantIds = (round.participants || []).map(p => p.id);
    if (!participantIds.length && typeof round.getParticipants === 'function') {
      try {
        const assigned = await round.getParticipants();
        participantIds = (assigned || []).map(p => p.id);
      } catch (e) {
        console.error('Error fetching round participants via association', e);
      }
    }

    const participants = await Participant.findAll({
      where: { id: { [Op.in]: participantIds } },
      include: [
        {
          model: Score,
          as: 'scores',
          where: { roundId: round.id, isSubmitted: true },
          required: false,
          include: [ { model: Criteria, as: 'criteria' }, { model: User, as: 'judge' } ]
        }
      ]
    });

    const scoreboard = participants.map(participant => {
      const scoresByCriteria = {};
      participant.scores.forEach(score => {
        if (!scoresByCriteria[score.criteriaId]) scoresByCriteria[score.criteriaId] = [];
        scoresByCriteria[score.criteriaId].push(score);
      });

      let totalWeightedScore = 0;
      let totalWeight = 0;
      let totalRawScore = 0;
      const totalWeightRaw = round.criteria.reduce((s, c) => s + parseFloat(c.weight || 0), 0);
      const weightFactor = totalWeightRaw > 0 && totalWeightRaw <= 1.05 ? 100 : 1;

      round.criteria.forEach(criteria => {
        const scores = scoresByCriteria[criteria.id] || [];
        const effectiveWeight = parseFloat(criteria.weight || 0) * weightFactor;
        if (scores.length > 0) {
          const avgScore = scores.reduce((sum, s) => sum + parseFloat(s.score), 0) / scores.length;
          const weightedScore = (avgScore / criteria.maxScore) * effectiveWeight;
          totalWeightedScore += weightedScore;
          totalRawScore += avgScore;
        }
        totalWeight += effectiveWeight;
      });

      const finalPercent = totalWeight > 0 ? (totalWeightedScore / totalWeight) * 100 : 0;

      return {
        participant,
        finalRaw: Number(totalRawScore.toFixed(2)),
        finalScorePercent: Number(finalPercent.toFixed(2)),
        scoresByCriteria,
        hasScores: (participant.scores && participant.scores.length > 0)
      };
    }).sort((a,b) => parseFloat(b.finalRaw) - parseFloat(a.finalRaw));

    res.render('admin/result', { title: 'Results', user: req.user, round, scoreboard });

  } catch (err) {
    console.error('Error loading results', err);
    req.flash('error_msg', 'Error loading results');
    return res.redirect('/admin/events');
  }
};

// Printable result view that triggers window.print()
export const printResults = async (req, res) => {
  try {
    const roundId = req.params.roundId;
    const round = await Round.findByPk(roundId, { include: [{ model: Event, as: 'event' }, { model: Criteria, as: 'criteria' }] });
    if (!round) {
      req.flash('error_msg', 'Round not found');
      return res.redirect('/admin/events');
    }

    // Build scoreboard (same as above)
    let participantIds = (round.participants || []).map(p => p.id);
    if (!participantIds.length && typeof round.getParticipants === 'function') {
      try {
        const assigned = await round.getParticipants();
        participantIds = (assigned || []).map(p => p.id);
      } catch (e) {
        console.error('Error fetching round participants via association', e);
      }
    }

    const participants = await Participant.findAll({
      where: { id: { [Op.in]: participantIds } },
      include: [
        {
          model: Score,
          as: 'scores',
          where: { roundId: round.id, isSubmitted: true },
          required: false,
          include: [ { model: Criteria, as: 'criteria' }, { model: User, as: 'judge' } ]
        }
      ]
    });

    const scoreboard = participants.map(participant => {
      const scoresByCriteria = {};
      participant.scores.forEach(score => {
        if (!scoresByCriteria[score.criteriaId]) scoresByCriteria[score.criteriaId] = [];
        scoresByCriteria[score.criteriaId].push(score);
      });

      let totalWeightedScore = 0;
      let totalWeight = 0;
      let totalRawScore = 0;
      const totalWeightRaw = round.criteria.reduce((s, c) => s + parseFloat(c.weight || 0), 0);
      const weightFactor = totalWeightRaw > 0 && totalWeightRaw <= 1.05 ? 100 : 1;

      round.criteria.forEach(criteria => {
        const scores = scoresByCriteria[criteria.id] || [];
        const effectiveWeight = parseFloat(criteria.weight || 0) * weightFactor;
        if (scores.length > 0) {
          const avgScore = scores.reduce((sum, s) => sum + parseFloat(s.score), 0) / scores.length;
          const weightedScore = (avgScore / criteria.maxScore) * effectiveWeight;
          totalWeightedScore += weightedScore;
          totalRawScore += avgScore;
        }
        totalWeight += effectiveWeight;
      });

      const finalPercent = totalWeight > 0 ? (totalWeightedScore / totalWeight) * 100 : 0;

      return {
        participant,
        finalRaw: Number(totalRawScore.toFixed(2)),
        finalScorePercent: Number(finalPercent.toFixed(2)),
        scoresByCriteria,
        hasScores: (participant.scores && participant.scores.length > 0)
      };
    }).sort((a,b) => parseFloat(b.finalRaw) - parseFloat(a.finalRaw));

    // Also include all rounds so the UI can offer a round selector
    const rounds = await Round.findAll({ order: [['order', 'ASC']], include: [{ model: Event, as: 'event' }] });

    res.render('admin/result_print', { title: `Results - ${round.name}`, round, scoreboard, rounds });
  } catch (err) {
    console.error('Error generating printable results', err);
    req.flash('error_msg', 'Unable to print results');
    return res.redirect('/admin/events');
  }
};
