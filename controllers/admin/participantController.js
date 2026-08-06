
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
import { Participant, Round, Event, Score } from "../../models/relationships.js";
import { logActivity } from "../../middleware/activityLogger.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../public/uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

export const listParticipants = async (req, res) => {
  try {
    const participants = await Participant.findAll({
      include: [{ model: Round, as: 'rounds' }],
      order: [['createdAt', 'DESC']]
    });
    res.render("admin/participants/list", { title: "Participants", user: req.user, participants });
  } catch (error) {
    console.error(error);
    req.flash("error_msg", "Error loading participants");
    res.redirect("/admin/dashboard");
  }
};

export const createParticipantPage = (req, res) => {
  res.render("admin/participants/create", { title: "Add Participant", user: req.user });
};

export const createParticipant = [
  upload.single('photo'),
  async (req, res) => {
    try {
      const { name, barangay, participantNumber } = req.body;
      const photo = req.file ? `/uploads/${req.file.filename}` : null;

      const participant = await Participant.create({
        name,
        barangay,
        participantNumber: participantNumber || `P${Date.now()}`,
        photo
      });

      // Automatically assign the participant to all rounds of all events
      const events = await Event.findAll({
        include: [{ model: Round, as: 'rounds' }]
      });

      for (const event of events) {
        for (const round of event.rounds) {
          await participant.addRound(round);
          await logActivity("ASSIGN_PARTICIPANT", `Participant ${participant.name} automatically assigned to round ${round.name} in event ${event.name}`, req.user.id, event.id);
        }
      }

      await logActivity("CREATE_PARTICIPANT", `Participant created: ${participant.name}`, req.user.id);
      req.flash("success_msg", "Participant added successfully and assigned to all events");
      res.redirect("/admin/participants");
    } catch (error) {
      console.error(error);
      req.flash("error_msg", "Error creating participant");
      res.redirect("/admin/participants");
    }
  }
];

export const viewParticipant = async (req, res) => {
  try {
    const participant = await Participant.findByPk(req.params.id, {
      include: [
        { model: Round, as: 'rounds', include: [{ model: Event, as: 'event' }] },
        { model: Score, as: 'scores', include: [{ model: Round, as: 'round' }] }
      ]
    });
    if (!participant) {
      req.flash("error_msg", "Participant not found");
      return res.redirect("/admin/participants");
    }
    res.render("admin/participants/view", { title: participant.name, user: req.user, participant });
  } catch (error) {
    console.error(error);
    req.flash("error_msg", "Error loading participant");
    res.redirect("/admin/participants");
  }
};

export const editParticipantPage = async (req, res) => {
  try {
    const participant = await Participant.findByPk(req.params.id);
    if (!participant) {
      req.flash("error_msg", "Participant not found");
      return res.redirect("/admin/participants");
    }
    res.render("admin/participants/edit", { title: "Edit Participant", user: req.user, participant });
  } catch (error) {
    console.error(error);
    req.flash("error_msg", "Error loading participant");
    res.redirect("/admin/participants");
  }
};

export const updateParticipant = [
  upload.single('photo'),
  async (req, res) => {
    try {
      const { name, barangay, participantNumber, isActive } = req.body;
      const participant = await Participant.findByPk(req.params.id);
      if (!participant) {
        req.flash("error_msg", "Participant not found");
        return res.redirect("/admin/participants");
      }

      const photo = req.file ? `/uploads/${req.file.filename}` : participant.photo;

      await participant.update({
        name,
        barangay,
        participantNumber,
        photo,
        isActive: isActive === 'on'
      });
      await logActivity("UPDATE_PARTICIPANT", `Participant updated: ${participant.name}`, req.user.id);
      req.flash("success_msg", "Participant updated successfully");
      res.redirect("/admin/participants");
    } catch (error) {
      console.error(error);
      req.flash("error_msg", "Error updating participant");
      res.redirect("/admin/participants");
    }
  }
];

export const deleteParticipant = async (req, res) => {
  try {
    const participant = await Participant.findByPk(req.params.id);
    if (!participant) {
      req.flash("error_msg", "Participant not found");
      return res.redirect("/admin/participants");
    }
    await logActivity("DELETE_PARTICIPANT", `Participant deleted: ${participant.name}`, req.user.id);
    await participant.destroy();
    req.flash("success_msg", "Participant deleted successfully");
    res.redirect("/admin/participants");
  } catch (error) {
    req.flash("error_msg", "Error deleting participant");
    res.redirect("/admin/participants");
  }
};

export const assignParticipantToRound = async (req, res) => {
  try {
    const { participantId, roundId } = req.body;
    const participant = await Participant.findByPk(participantId);
    const round = await Round.findByPk(roundId);
    if (!participant || !round) {
      req.flash("error_msg", "Participant or Round not found");
      return res.redirect("/admin/participants");
    }
    await participant.addRound(round);
    await logActivity("ASSIGN_PARTICIPANT", `Participant ${participant.name} assigned to round ${round.name}`, req.user.id, round.eventId);
    req.flash("success_msg", "Participant assigned successfully");
    res.redirect(`/admin/events/${round.eventId}/rounds`);
  } catch (error) {
    req.flash("error_msg", "Error assigning participant");
    res.redirect("/admin/participants");
  }
};

export const assignBulkParticipantsToRound = async (req, res) => {
  try {
    const { roundId, participantIds } = req.body;
    const round = await Round.findByPk(roundId);
    if (!round) {
      req.flash("error_msg", "Round not found");
      return res.redirect("/admin/events");
    }

    // Get current assigned participants
    const currentAssigned = await round.getParticipants();
    const currentIds = currentAssigned.map(p => p.id.toString());

    // Determine participants to add and remove
    const newIds = participantIds || [];
    const toAdd = newIds.filter(id => !currentIds.includes(id));
    const toRemove = currentIds.filter(id => !newIds.includes(id));

    // Add new participants
    if (toAdd.length > 0) {
      const participantsToAdd = await Participant.findAll({ where: { id: toAdd } });
      await round.addParticipants(participantsToAdd);
      await logActivity("ASSIGN_PARTICIPANTS", `Added ${toAdd.length} participants to round ${round.name}`, req.user.id, round.eventId);
    }

    // Remove participants
    if (toRemove.length > 0) {
      const participantsToRemove = await Participant.findAll({ where: { id: toRemove } });
      await round.removeParticipants(participantsToRemove);
      await logActivity("REMOVE_PARTICIPANTS", `Removed ${toRemove.length} participants from round ${round.name}`, req.user.id, round.eventId);
    }

    req.flash("success_msg", "Participant assignments updated successfully");
    res.redirect(`/admin/rounds/${roundId}/participants`);
  } catch (error) {
    console.error(error);
    req.flash("error_msg", "Error updating participant assignments");
    res.redirect("/admin/events");
  }
};

export const updateRoundParticipants = async (req, res) => {
  try {
    const { roundId } = req.params;
    const { participantIds } = req.body; // Array of participant IDs to assign
    const round = await Round.findByPk(roundId);
    if (!round) {
      req.flash("error_msg", "Round not found");
      return res.redirect("/admin/events");
    }

    // Get current assigned participants
    const currentParticipants = await round.getParticipants();
    const currentIds = currentParticipants.map(p => p.id);

    // Participants to add (in participantIds but not in currentIds)
    const toAdd = participantIds ? participantIds.filter(id => !currentIds.includes(parseInt(id))) : [];

    // Participants to remove (in currentIds but not in participantIds)
    const toRemove = participantIds ? currentIds.filter(id => !participantIds.includes(id.toString())) : currentIds;

    // Add new participants
    for (const participantId of toAdd) {
      const participant = await Participant.findByPk(participantId);
      if (participant) {
        await round.addParticipant(participant);
        await logActivity("ASSIGN_PARTICIPANT", `Participant ${participant.name} assigned to round ${round.name}`, req.user.id, round.eventId);
      }
    }

    // Remove participants
    for (const participantId of toRemove) {
      const participant = await Participant.findByPk(participantId);
      if (participant) {
        await round.removeParticipant(participant);
        await logActivity("UNASSIGN_PARTICIPANT", `Participant ${participant.name} unassigned from round ${round.name}`, req.user.id, round.eventId);
      }
    }

    req.flash("success_msg", "Participants updated successfully");
    res.redirect(`/admin/rounds/${roundId}/participants`);
  } catch (error) {
    console.error(error);
    req.flash("error_msg", "Error updating participants");
    res.redirect("/admin/events");
  }
};
