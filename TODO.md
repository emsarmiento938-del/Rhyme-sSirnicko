# TODO: Change Quick Actions to Sidebar in Admin Dashboard

- [x] Update views/admin/dashboard.xian to restructure layout with a left sidebar containing Quick Actions and main content on the right
- [x] Ensure responsive design (sidebar stacks below main content on mobile devices)
- [x] Move "View All Events" button to sidebar and remove from main content
- [ ] Test the layout changes visually

# TODO: Add functionality to assign participants to rounds in admin panel

- [x] Add new controller function in roundController.js to display assign participants page for a round
- [x] Add new route GET /admin/rounds/:roundId/participants in routes/index.js
- [x] Create new view views/admin/rounds/participants.xian with form to assign/unassign participants
- [x] Update assignParticipantToRound function in participantController.js to handle bulk operations
- [x] Add "Manage Participants" link in views/admin/rounds/list.xian for each round
- [x] Add "Participants" link in views/admin/events/view.xian for each round
- [x] Test the new functionality by assigning/unassigning participants to rounds
- [x] Ensure the participant count updates correctly in the rounds list
