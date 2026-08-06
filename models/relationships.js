
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
import { Event } from "./eventModel.js";
import { Round } from "./roundModel.js";
import { Participant } from "./participantModel.js";
import { Criteria } from "./criteriaModel.js";
import { Score } from "./scoreModel.js";
import { User } from "./userModel.js";
import { ActivityLog } from "./activityLogModel.js";
import { sequelize } from "./db.js";

// Event - Round (One-to-Many)
Event.hasMany(Round, { foreignKey: 'eventId', as: 'rounds' });
Round.belongsTo(Event, { foreignKey: 'eventId', as: 'event' });

// Round - Criteria (One-to-Many)
Round.hasMany(Criteria, { foreignKey: 'roundId', as: 'criteria' });
Criteria.belongsTo(Round, { foreignKey: 'roundId', as: 'round' });

// Event - User (Many-to-Many for Judges)
Event.belongsToMany(User, { 
  through: 'EventJudges', 
  foreignKey: 'eventId',
  otherKey: 'judgeId',
  as: 'judges'
});
User.belongsToMany(Event, { 
  through: 'EventJudges', 
  foreignKey: 'judgeId',
  otherKey: 'eventId',
  as: 'assignedEvents'
});

// Round - Participant (Many-to-Many)
Round.belongsToMany(Participant, { 
  through: 'ParticipantRounds', 
  foreignKey: 'roundId',
  otherKey: 'participantId',
  as: 'participants'
});
Participant.belongsToMany(Round, { 
  through: 'ParticipantRounds', 
  foreignKey: 'participantId',
  otherKey: 'roundId',
  as: 'rounds'
});

// Score relationships
Score.belongsTo(Participant, { foreignKey: 'participantId', as: 'participant' });
Score.belongsTo(Criteria, { foreignKey: 'criteriaId', as: 'criteria' });
Score.belongsTo(User, { foreignKey: 'judgeId', as: 'judge' });
Score.belongsTo(Round, { foreignKey: 'roundId', as: 'round' });

Participant.hasMany(Score, { foreignKey: 'participantId', as: 'scores' });
Criteria.hasMany(Score, { foreignKey: 'criteriaId', as: 'scores' });
User.hasMany(Score, { foreignKey: 'judgeId', as: 'scores' });
Round.hasMany(Score, { foreignKey: 'roundId', as: 'scores' });

// ActivityLog relationships
ActivityLog.belongsTo(User, { foreignKey: 'userId', as: 'user' });
ActivityLog.belongsTo(Event, { foreignKey: 'eventId', as: 'event' });
User.hasMany(ActivityLog, { foreignKey: 'userId', as: 'activityLogs' });
Event.hasMany(ActivityLog, { foreignKey: 'eventId', as: 'activityLogs' });

export { Event, Round, Participant, Criteria, Score, User, ActivityLog, sequelize };
