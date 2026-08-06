# ✅ Event Judge Scoring Tabulation System - Setup Complete!

## 🎉 Database Setup Successful

Your MySQL database has been successfully created and configured!

---

## 📋 Login Credentials

### **Admin Account**
- **Email:** `admin@eventtabulation.com`
- **Password:** `admin123`
- **Role:** Administrator (Full Access)

### **Judge Accounts**
1. **Judge 1**
   - Email: `judge1@eventtabulation.com`
   - Password: `judge123`

2. **Judge 2**
   - Email: `judge2@eventtabulation.com`
   - Password: `judge123`

3. **Judge 3**
   - Email: `judge3@eventtabulation.com`
   - Password: `judge123`

---

## 🚀 How to Run the Application

1. **Start the server:**
   ```bash
   npm run xian
   ```
   This will start the server with nodemon (auto-restart on file changes)

   Or for production:
   ```bash
   npm run xian-start
   ```

2. **Access the application:**
   - Open your browser and go to: **http://localhost:3000**

3. **Login:**
   - Use the admin credentials above to access the admin panel
   - Or use judge credentials to access the judge scoring panel

---

## 📦 Available NPM Scripts

- `npm run xian` - Start development server with auto-restart
- `npm run xian-start` - Start production server
- `npm run setup` - Create database and run migrations
- `npm run migrate` - Run database migrations only
- `npm run seed` - Seed admin and judge accounts
- `npm create:model <ModelName>` - Generate new Sequelize model
- `npm create:controller <ControllerName>` - Generate new Express controller

---

## 🗄️ Database Information

- **Database Name:** `eventtabulationsys`
- **Host:** `localhost`
- **User:** `root`
- **Password:** (empty)
- **Dialect:** MySQL

### Tables Created:
- `Users` - Admin and Judge accounts
- `Events` - Event information
- `Rounds` - Event rounds
- `Participants` - Competition participants
- `Criteria` - Scoring criteria
- `Scores` - Judge scores
- `ActivityLogs` - System activity logs
- `EventJudges` - Event-Judge associations
- `ParticipantRounds` - Participant-Round associations

---

## 🔧 Troubleshooting

### If database connection fails:
1. Make sure Laragon MySQL is running
2. Check database credentials in `models/db.js`
3. Re-run setup: `npm run setup`

### If you need to reset the database:
1. Drop the database in phpMyAdmin or MySQL CLI
2. Run: `npm run setup`
3. Run: `npm run seed`

---

## 🎯 Admin Features

As an admin, you can:
- ✅ Create and manage events
- ✅ Set up rounds for each event
- ✅ Add and manage participants
- ✅ Define scoring criteria with weights
- ✅ Manage judge accounts
- ✅ Assign judges to events
- ✅ View live scoreboards
- ✅ Generate printable results
- ✅ View activity logs

---

## 👨‍⚖️ Judge Features

As a judge, you can:
- ✅ View assigned events
- ✅ Score participants based on criteria
- ✅ Submit scores
- ✅ View scoring history

---

## 📱 Next Steps

1. **Login as Admin:** http://localhost:3000/login
2. **Create your first event**
3. **Add participants**
4. **Set up rounds and criteria**
5. **Assign judges**
6. **Start scoring!**

---

## 🛠️ Built With

- **XianFire Framework** by Christian I. Cabrera
- **Node.js** + **Express**
- **Sequelize ORM** + **MySQL**
- **Handlebars (HBS)** templating
- **Tailwind CSS**
- **bcrypt** for password hashing
- **multer** for file uploads

---

## 📄 License

MIT License - Copyright (c) 2025 Christian I. Cabrera
Mindoro State University - Philippines

---

**🎊 Your system is ready to use! Happy judging! 🎊**
