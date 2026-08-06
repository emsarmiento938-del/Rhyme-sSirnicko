# 🚂 Railway Deployment Guide - XianFire Event Tabulation System

Complete step-by-step guide to deploy this XianFire application with MySQL on Railway.

---

## 📋 Prerequisites

- GitHub account with repository access
- Railway account (sign up at https://railway.app)
- Your repository: https://github.com/emsarmiento938-del/Rhyme-sSirnicko

---

## 🚀 Deployment Steps

### Step 1: Create Railway Project

1. Go to https://railway.app
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Authorize Railway to access your GitHub account
5. Select repository: **emsarmiento938-del/Rhyme-sSirnicko**
6. Click **"Deploy Now"**

### Step 2: Add MySQL Database

1. In your Railway project dashboard, click **"+ New"**
2. Select **"Database"**
3. Choose **"Add MySQL"**
4. Railway will automatically provision a MySQL database
5. Wait for the database to be ready (green status)

### Step 3: Configure Environment Variables

Railway will automatically set MySQL variables. You need to add these custom variables:

1. Click on your **web service** (not the database)
2. Go to **"Variables"** tab
3. Click **"+ New Variable"** and add:

```
NODE_ENV=production
SESSION_SECRET=your-random-secret-key-here-change-this
ADMIN_NAME=System Administrator
ADMIN_EMAIL=admin@eventtabulation.com
ADMIN_PASSWORD=admin123
```

**Important:** Change `SESSION_SECRET` to a random string for security!

#### Generated Railway Variables (Auto-configured):
These are automatically set by Railway when you add MySQL:
- `MYSQLHOST`
- `MYSQLPORT`
- `MYSQLDATABASE`
- `MYSQLUSER`
- `MYSQLPASSWORD`
- `MYSQL_URL`

### Step 4: Deploy

1. Railway will automatically deploy after adding environment variables
2. Wait for deployment to complete (check the **"Deployments"** tab)
3. Look for these logs:
   ```
   🚂 Railway Setup Starting...
   ✅ Database connection successful!
   ✅ Database tables created/updated!
   ✅ Admin account created
   🔥 XianFire running at...
   ```

### Step 5: Access Your Application

1. Go to **"Settings"** tab in your web service
2. Scroll to **"Networking"** section
3. Click **"Generate Domain"**
4. Your app will be available at: `https://your-app-name.up.railway.app`

---

## 🔐 Default Login Credentials

After deployment, use these credentials:

### Admin Account
- **URL:** `https://your-app-name.up.railway.app/login`
- **Email:** `admin@eventtabulation.com`
- **Password:** `admin123`

### Judge Accounts
- **Judge 1:** judge1@eventtabulation.com / judge123
- **Judge 2:** judge2@eventtabulation.com / judge123
- **Judge 3:** judge3@eventtabulation.com / judge123

**⚠️ Important:** Change these passwords after first login!

---

## 🔧 Railway Configuration Files

### Files Added for Railway:

1. **`.env.example`** - Template for environment variables
2. **`railway.json`** - Railway deployment configuration
3. **`railway-setup.js`** - Automated setup script for Railway
4. **Updated `models/db.js`** - MySQL connection with Railway support
5. **Updated `index.js`** - Environment variable support
6. **Updated `package.json`** - Railway start script

---

## 📊 Database Configuration

The application automatically uses Railway's MySQL connection:

```javascript
// Railway provides these environment variables:
MYSQLHOST       - Database host
MYSQLPORT       - Database port (usually 3306)
MYSQLDATABASE   - Database name
MYSQLUSER       - Database username
MYSQLPASSWORD   - Database password
```

The app will:
1. Connect to Railway MySQL
2. Create all required tables automatically
3. Seed admin and judge accounts
4. Start the XianFire server

---

## 🛠️ Troubleshooting

### Deployment Failed?

**Check logs:**
1. Go to **"Deployments"** tab
2. Click on the failed deployment
3. Check the build and deploy logs

**Common issues:**

#### 1. Database Connection Error
```
❌ Unable to connect to database
```
**Solution:**
- Ensure MySQL service is added
- Check that MySQL is running (green status)
- Verify environment variables are set

#### 2. Port Already in Use
```
⚠️ Port 3000 is busy
```
**Solution:**
- This shouldn't happen on Railway
- If it does, Railway will auto-assign a port

#### 3. Build Failed
```
❌ npm install failed
```
**Solution:**
- Check `package.json` for errors
- Ensure all dependencies are listed
- Try redeploying

### Need to Reset Database?

1. Go to MySQL service in Railway
2. Click **"Data"** tab
3. Click **"Query"** and run:
   ```sql
   DROP DATABASE eventtabulationsys;
   CREATE DATABASE eventtabulationsys;
   ```
4. Redeploy your application

### Need to Re-seed Accounts?

Railway automatically runs seed on every deployment. To manually seed:

1. Go to your web service
2. Click **"Settings"** → **"Deploy"**
3. Click **"Redeploy"**

---

## 🔄 Updating Your Application

### Via GitHub (Automatic):

1. Make changes to your code locally
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Your update message"
   git push rhyme main
   ```
3. Railway automatically detects changes and redeploys

### Via Railway CLI:

1. Install Railway CLI:
   ```bash
   npm i -g @railway/cli
   ```
2. Login:
   ```bash
   railway login
   ```
3. Link project:
   ```bash
   railway link
   ```
4. Deploy:
   ```bash
   railway up
   ```

---

## 📱 Production Checklist

Before going live, ensure:

- [ ] Changed `SESSION_SECRET` to a strong random string
- [ ] Changed admin password via admin panel
- [ ] Changed all judge passwords
- [ ] Tested all functionality (events, scoring, results)
- [ ] Uploaded test participant photos
- [ ] Verified scoreboard calculations
- [ ] Tested print results feature
- [ ] Set up custom domain (optional)

---

## 🌐 Custom Domain (Optional)

To use your own domain:

1. Go to **"Settings"** → **"Networking"**
2. Click **"Custom Domain"**
3. Enter your domain (e.g., `events.yourdomain.com`)
4. Add the CNAME record to your DNS provider:
   ```
   CNAME: events
   Value: your-app-name.up.railway.app
   ```
5. Wait for DNS propagation (5-30 minutes)

---

## 📊 Monitoring

### View Logs:
1. Click on your web service
2. Go to **"Observability"** tab
3. View real-time logs

### Check Database:
1. Click on MySQL service
2. Go to **"Data"** tab
3. Run queries to check data

### Metrics:
1. Go to **"Metrics"** tab
2. Monitor CPU, Memory, Network usage

---

## 💰 Railway Pricing

- **Starter Plan:** Free ($5 credit/month)
- **Developer Plan:** $5/month (includes $5 credit)
- **Team Plans:** Custom pricing

**Typical Usage for this app:**
- Web Service: ~$2-3/month
- MySQL Database: ~$3-5/month
- **Total:** ~$5-8/month

---

## 🆘 Support

### Railway Support:
- Discord: https://discord.gg/railway
- Documentation: https://docs.railway.app
- Status: https://status.railway.app

### Application Issues:
- GitHub Issues: https://github.com/emsarmiento938-del/Rhyme-sSirnicko/issues
- Check logs in Railway dashboard
- Review `SETUP_COMPLETE.md` for local testing

---

## 📦 What Happens on Deploy?

```
1. Railway clones your GitHub repository
   ↓
2. Installs dependencies (npm install)
   ↓
3. Runs railway-setup.js
   - Connects to MySQL
   - Creates/updates database tables
   ↓
4. Runs seed.js
   - Creates admin account
   - Creates judge accounts
   ↓
5. Starts the application (node index.js)
   - XianFire server starts
   - Listens on assigned port
   ↓
6. Application is live! 🎉
```

---

## ✅ Deployment Complete!

Your XianFire Event Judge Scoring Tabulation System is now live on Railway! 🚂

**Next Steps:**
1. Visit your Railway app URL
2. Login as admin
3. Create your first event
4. Add participants and judges
5. Start scoring!

---

**Built with XianFire Framework**
Copyright (c) 2025 Christian I. Cabrera
Mindoro State University - Philippines
