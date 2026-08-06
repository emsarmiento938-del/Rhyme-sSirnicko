# ✅ Railway Deployment Checklist

Use this checklist to ensure successful deployment to Railway.

---

## 📦 Pre-Deployment (Local Testing)

- [ ] Application runs locally without errors
- [ ] Database connection works
- [ ] All routes are accessible
- [ ] Login/logout functions properly
- [ ] Admin panel loads correctly
- [ ] Judge panel loads correctly
- [ ] File uploads work (participant photos)
- [ ] Scoring system calculates correctly

**Test locally:**
```bash
npm run setup    # Create database
npm run seed     # Seed accounts
npm run xian     # Start server
```

---

## 🚀 Railway Setup

### Project Creation
- [ ] Railway account created
- [ ] GitHub connected to Railway
- [ ] New project created from repository
- [ ] Repository: `emsarmiento938-del/Rhyme-sSirnicko` selected

### Database Setup
- [ ] MySQL database added to project
- [ ] MySQL service shows green (running) status
- [ ] MySQL connection variables auto-populated

### Environment Variables Set
- [ ] `NODE_ENV` = `production`
- [ ] `SESSION_SECRET` = random secure string (changed from default)
- [ ] `ADMIN_EMAIL` = your admin email
- [ ] `ADMIN_PASSWORD` = your admin password (change after first login)
- [ ] Railway auto-variables present:
  - [ ] `MYSQLHOST`
  - [ ] `MYSQLPORT`
  - [ ] `MYSQLDATABASE`
  - [ ] `MYSQLUSER`
  - [ ] `MYSQLPASSWORD`

### Deployment
- [ ] Initial deployment completed successfully
- [ ] Build logs show no errors
- [ ] Deploy logs show:
  - [ ] "🚂 Railway Setup Starting..."
  - [ ] "✅ Database connection successful!"
  - [ ] "✅ Database tables created/updated!"
  - [ ] "✅ Admin account created"
  - [ ] "🔥 XianFire running at..."
- [ ] Service status shows "Active"

### Domain Setup
- [ ] Railway domain generated
- [ ] Domain accessible in browser
- [ ] HTTPS working (automatic)

---

## 🔐 Post-Deployment (Security)

- [ ] Can access login page
- [ ] Admin login works with default credentials
- [ ] Changed admin password immediately
- [ ] Created new judges if needed
- [ ] Changed default judge passwords
- [ ] Verified session security (HTTPS)
- [ ] Tested logout functionality

---

## 🧪 Functionality Testing

### Admin Functions
- [ ] Admin dashboard loads
- [ ] Can create events
- [ ] Can add participants
- [ ] Can upload participant photos
- [ ] Can create rounds
- [ ] Can add criteria
- [ ] Can manage judges
- [ ] Can assign judges to events
- [ ] Can view scoreboard
- [ ] Can view/print results

### Judge Functions
- [ ] Judge can login
- [ ] Judge dashboard loads
- [ ] Can see assigned events
- [ ] Can access scoring panel
- [ ] Can enter scores
- [ ] Can submit scores
- [ ] Scores save correctly

### Scoring System
- [ ] Scores calculate properly
- [ ] Weighted scores work correctly
- [ ] Rankings display in correct order
- [ ] Scoreboard updates in real-time
- [ ] Print results page works

---

## 📊 Database Verification

- [ ] All tables created:
  - [ ] Users
  - [ ] Events
  - [ ] Rounds
  - [ ] Participants
  - [ ] Criteria
  - [ ] Scores
  - [ ] ActivityLogs
  - [ ] EventJudges
  - [ ] ParticipantRounds
- [ ] Admin account exists in Users table
- [ ] Judge accounts exist in Users table
- [ ] Can query database via Railway dashboard

---

## 🔄 CI/CD (Continuous Deployment)

- [ ] GitHub repository linked
- [ ] Auto-deploy on push enabled
- [ ] Test push to verify auto-deploy:
  ```bash
  git add .
  git commit -m "Test auto-deploy"
  git push rhyme main
  ```
- [ ] Railway detects change and redeploys
- [ ] Application still works after redeploy

---

## 📱 Production Readiness

### Performance
- [ ] Application loads in < 3 seconds
- [ ] Database queries are optimized
- [ ] Images load properly
- [ ] No console errors in browser

### Monitoring
- [ ] Railway logs accessible
- [ ] Can view deployment history
- [ ] Can see resource usage (CPU, Memory)
- [ ] Set up alerts (optional)

### Backup Plan
- [ ] Know how to rollback deployment
- [ ] Can access Railway MySQL backup
- [ ] Have local backup of database structure
- [ ] Documentation is complete

---

## 🌐 Optional Enhancements

- [ ] Custom domain configured
- [ ] DNS records updated
- [ ] SSL certificate active
- [ ] Email notifications setup (if needed)
- [ ] Analytics added (if needed)

---

## 📚 Documentation

- [ ] `README.md` updated with deployment info
- [ ] `RAILWAY_DEPLOYMENT.md` reviewed
- [ ] `RAILWAY_QUICK_START.md` available
- [ ] Environment variables documented
- [ ] Admin credentials stored securely
- [ ] Team trained on system usage

---

## 🆘 Emergency Procedures

### If Deployment Fails:
1. [ ] Check build logs
2. [ ] Verify all environment variables
3. [ ] Ensure MySQL is running
4. [ ] Check Railway status page
5. [ ] Review recent code changes
6. [ ] Rollback to last working deployment

### If Database Issues:
1. [ ] Check MySQL service status
2. [ ] Verify connection variables
3. [ ] Test database connection in logs
4. [ ] Check table creation logs
5. [ ] Consider database reset if needed

### If Application Crashes:
1. [ ] Check application logs
2. [ ] Look for error messages
3. [ ] Verify environment variables
4. [ ] Check memory/CPU usage
5. [ ] Consider service restart

---

## 📞 Support Resources

- **Railway Support:** https://discord.gg/railway
- **Railway Docs:** https://docs.railway.app
- **GitHub Repo:** https://github.com/emsarmiento938-del/Rhyme-sSirnicko
- **Railway Status:** https://status.railway.app

---

## ✅ Final Verification

Before announcing to users:

- [ ] All checklist items above completed
- [ ] Tested with multiple judges simultaneously
- [ ] Verified scoring accuracy with test data
- [ ] Confirmed all features work as expected
- [ ] Created user documentation/guide
- [ ] Set up support channel for users
- [ ] Have admin contact information ready

---

## 🎉 Deployment Complete!

**Your XianFire Event Tabulation System is live on Railway!**

**Production URL:** `https://your-app-name.up.railway.app`

**Date Deployed:** _________________

**Deployed By:** _________________

**Notes:** 
_________________________________
_________________________________
_________________________________

---

**Built with XianFire Framework**
Copyright (c) 2025 Christian I. Cabrera
