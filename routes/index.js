
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
    
import express from "express";
import { homePage } from "../controllers/homeController.js";
import { loginPage, registerPage, forgotPasswordPage, dashboardPage, loginUser, registerUser, logoutUser } from "../controllers/authController.js";
import { requireAuth, requireAdmin, requireJudge } from "../middleware/auth.js";

// Admin Controllers
import { adminDashboard } from "../controllers/admin/dashboardController.js";
import { listEvents, createEventPage, createEvent, viewEvent, editEventPage, updateEvent, deleteEvent, archiveEvent } from "../controllers/admin/eventController.js";
import { listRounds, createRoundPage, createRound, updateRound, deleteRound, manageParticipantsPage } from "../controllers/admin/roundController.js";
import { listParticipants, createParticipantPage, createParticipant, viewParticipant, editParticipantPage, updateParticipant, deleteParticipant, assignParticipantToRound, assignBulkParticipantsToRound, updateRoundParticipants } from "../controllers/admin/participantController.js";
import { listCriteria, createCriteriaPage, createCriteria, updateCriteria, deleteCriteria } from "../controllers/admin/criteriaController.js";
import { listJudges, createJudgePage, createJudge, assignJudgeToEvent, assignJudgeToAllEvents, removeJudgeFromEvent, deleteJudge } from "../controllers/admin/judgeController.js";
import { viewScoreboard, latestScoreboardRedirect, viewResults, printResults, latestResultsPrintRedirect } from "../controllers/admin/scoreController.js";

// Judge Controllers
import { judgeDashboard } from "../controllers/judge/dashboardController.js";
import { scoringPanel, submitScores } from "../controllers/judge/scoreController.js";

const router = express.Router();

// Development-only helper: render admin dashboard with mock data
if (process.env.NODE_ENV !== 'production') {
  router.get('/dev/admin', (req, res) => {
    // set a fake admin session so templates that rely on session/user behave normally
    req.session = req.session || {};
    req.session.userId = req.session.userId || 1;
    req.session.userRole = 'admin';

    const mockUser = { id: req.session.userId, name: 'Dev Admin', role: 'admin' };
    const now = new Date();
    const mockRecent = [
      { id: 1, name: 'Sample Event A', date: now.toISOString(), rounds: [] },
      { id: 2, name: 'Sample Event B', date: now.toISOString(), rounds: [] }
    ];

    return res.render('admin/dashboard', {
      title: 'Admin Dashboard (DEV)',
      user: mockUser,
      totalEvents: 2,
      totalParticipants: 10,
      totalJudges: 3,
      totalCriteria: 5,
      ongoingEvents: 1,
      upcomingEvents: 1,
      recentEvents: mockRecent
    });
  });
}

// Public Routes
router.get("/", homePage);
router.get("/login", loginPage);
router.post("/login", loginUser);
router.get("/register", registerPage);
router.post("/register", registerUser);
router.get("/forgot-password", forgotPasswordPage);
router.get("/dashboard", requireAuth, dashboardPage);
router.get("/logout", logoutUser);

// Admin Routes
router.get("/admin/dashboard", requireAuth, requireAdmin, adminDashboard);

// Events
router.get("/admin/events", requireAuth, requireAdmin, listEvents);
router.get("/admin/events/create", requireAuth, requireAdmin, createEventPage);
router.post("/admin/events/create", requireAuth, requireAdmin, createEvent);
router.get("/admin/events/:id", requireAuth, requireAdmin, viewEvent);
router.get("/admin/events/:id/edit", requireAuth, requireAdmin, editEventPage);
router.post("/admin/events/:id/edit", requireAuth, requireAdmin, updateEvent);
router.post("/admin/events/:id/delete", requireAuth, requireAdmin, deleteEvent);
router.post("/admin/events/:id/archive", requireAuth, requireAdmin, archiveEvent);

// Rounds
router.get("/admin/events/:eventId/rounds", requireAuth, requireAdmin, listRounds);
router.get("/admin/events/:eventId/rounds/create", requireAuth, requireAdmin, createRoundPage);
router.post("/admin/events/:eventId/rounds/create", requireAuth, requireAdmin, createRound);
router.post("/admin/rounds/:id/update", requireAuth, requireAdmin, updateRound);
router.post("/admin/rounds/:id/delete", requireAuth, requireAdmin, deleteRound);
router.get("/admin/rounds/:roundId/participants", requireAuth, requireAdmin, manageParticipantsPage);

// Participants
router.get("/admin/participants", requireAuth, requireAdmin, listParticipants);
router.get("/admin/participants/create", requireAuth, requireAdmin, createParticipantPage);
router.post("/admin/participants/create", requireAuth, requireAdmin, createParticipant);
router.get("/admin/participants/:id", requireAuth, requireAdmin, viewParticipant);
router.get("/admin/participants/:id/edit", requireAuth, requireAdmin, editParticipantPage);
router.post("/admin/participants/:id/edit", requireAuth, requireAdmin, updateParticipant);
router.post("/admin/participants/:id/delete", requireAuth, requireAdmin, deleteParticipant);
router.post("/admin/participants/assign", requireAuth, requireAdmin, assignParticipantToRound);
router.post("/admin/participants/assign-bulk", requireAuth, requireAdmin, assignBulkParticipantsToRound);
router.post("/admin/rounds/:roundId/participants", requireAuth, requireAdmin, updateRoundParticipants);

// Criteria
router.get("/admin/rounds/:roundId/criteria", requireAuth, requireAdmin, listCriteria);
router.get("/admin/rounds/:roundId/criteria/create", requireAuth, requireAdmin, createCriteriaPage);
router.post("/admin/rounds/:roundId/criteria/create", requireAuth, requireAdmin, createCriteria);
router.post("/admin/criteria/:id/update", requireAuth, requireAdmin, updateCriteria);
router.post("/admin/criteria/:id/delete", requireAuth, requireAdmin, deleteCriteria);

// Judges
router.get("/admin/judges", requireAuth, requireAdmin, listJudges);
router.get("/admin/judges/create", requireAuth, requireAdmin, createJudgePage);
router.post("/admin/judges/create", requireAuth, requireAdmin, createJudge);
router.post("/admin/judges/assign", requireAuth, requireAdmin, assignJudgeToEvent);
router.post("/admin/judges/assign-all", requireAuth, requireAdmin, assignJudgeToAllEvents);
router.post("/admin/events/:eventId/judges/:judgeId/remove", requireAuth, requireAdmin, removeJudgeFromEvent);
router.post("/admin/judges/:id/delete", requireAuth, requireAdmin, deleteJudge);

// Scores
router.get("/admin/rounds/:roundId/scoreboard", requireAuth, requireAdmin, viewScoreboard);

// Backwards-compatible alias: open the most recent scoreboard
router.get("/admin/score", requireAuth, requireAdmin, latestScoreboardRedirect);

// Results (top ranks and printable export)
router.get("/admin/result", requireAuth, requireAdmin, latestResultsPrintRedirect);
router.get("/admin/result/print/:roundId", requireAuth, requireAdmin, printResults);

// Judge Routes
router.get("/judge/dashboard", requireAuth, requireJudge, judgeDashboard);
router.get("/judge/rounds/:roundId/scoring", requireAuth, requireJudge, scoringPanel);
router.post("/judge/rounds/:roundId/scoring", requireAuth, requireJudge, submitScores);

export default router;