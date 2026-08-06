# 🚂 Railway Quick Start - 5 Minutes to Deploy!

Deploy your XianFire Event Tabulation System to Railway in 5 minutes.

---

## 🎯 Quick Deployment (5 Steps)

### 1️⃣ Create Railway Account
- Go to https://railway.app
- Sign up with GitHub

### 2️⃣ Deploy from GitHub
1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose: **emsarmiento938-del/Rhyme-sSirnicko**
4. Click **"Deploy"**

### 3️⃣ Add MySQL Database
1. Click **"+ New"** in your project
2. Select **"Database"** → **"Add MySQL"**
3. Wait for green checkmark ✅

### 4️⃣ Set Environment Variables
Click on your **web service** → **"Variables"** → Add these:

```env
NODE_ENV=production
SESSION_SECRET=your-super-secret-random-key-here
ADMIN_EMAIL=admin@eventtabulation.com
ADMIN_PASSWORD=admin123
```

💡 **Tip:** Generate a random SESSION_SECRET at https://randomkeygen.com/

### 5️⃣ Get Your URL
1. Go to **"Settings"** → **"Networking"**
2. Click **"Generate Domain"**
3. Your app is live at: `https://your-app-name.up.railway.app`

---

## 🔑 Login

**Admin:**
- URL: `https://your-app-name.up.railway.app/login`
- Email: `admin@eventtabulation.com`
- Password: `admin123`

---

## ✅ That's It!

Your app is now live on Railway! 🎉

**See `RAILWAY_DEPLOYMENT.md` for detailed guide.**

---

## 🆘 Issues?

**Deployment failed?** Check:
- MySQL service is added and running (green)
- Environment variables are set correctly
- Check deployment logs for errors

**Can't connect?** Ensure:
- Domain is generated
- App shows "Active" status
- Wait 2-3 minutes after first deploy

---

## 📱 Quick Links

- **Railway Dashboard:** https://railway.app/dashboard
- **Your Repository:** https://github.com/emsarmiento938-del/Rhyme-sSirnicko
- **Railway Docs:** https://docs.railway.app
- **Full Guide:** See `RAILWAY_DEPLOYMENT.md`

---

**🚀 Ready to Score Events!**
