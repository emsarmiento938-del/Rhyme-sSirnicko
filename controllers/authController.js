
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
    
import bcrypt from "bcrypt";
import { User, sequelize } from "../models/userModel.js";
import { logActivity } from "../middleware/activityLogger.js";

let authBootstrapPromise = null;
let authReady = false;

const ensureDefaultAdmin = async () => {
  try {
    const email = (process.env.ADMIN_EMAIL || "admin@eventtabulation.com").trim().toLowerCase();
    const password = process.env.ADMIN_PASSWORD || "admin123";
    const name = process.env.ADMIN_NAME || "System Administrator";
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingAdmin = await User.findOne({
      where: sequelize.where(
        sequelize.fn('LOWER', sequelize.col('email')),
        email
      )
    });

    if (existingAdmin) {
      await existingAdmin.update({
        role: "admin",
        isActive: true,
        name,
        email,
        password: hashedPassword
      });
      console.log(`✅ Default admin account ensured: ${email}`);
      return existingAdmin;
    }

    const admin = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "admin",
      isActive: true
    });

    console.log(`✅ Default admin account created: ${email}`);
    return admin;
  } catch (error) {
    console.error("Failed to ensure default admin account:", error);
    return null;
  }
};

const initializeAuthModule = async () => {
  if (authBootstrapPromise) {
    return authBootstrapPromise;
  }

  authBootstrapPromise = (async () => {
    try {
      await sequelize.authenticate();
      if (process.env.AUTO_SYNC_DB === "true") {
        await sequelize.sync({ alter: false, force: false });
      }
      await ensureDefaultAdmin();
      authReady = true;
      console.log("✅ Auth module initialized against Supabase DB");
    } catch (error) {
      authReady = false;
      console.error("Auth module initialization failed:", error);
    }
  })();

  return authBootstrapPromise;
};

export const ensureAuthReady = async () => {
  if (authReady) return true;
  try {
    await initializeAuthModule();
    return authReady;
  } catch (error) {
    return false;
  }
};

export const loginPage = (req, res) => res.render("login", { title: "Login" });
export const registerPage = (req, res) => res.render("register", { title: "Register" });
export const forgotPasswordPage = (req, res) => res.render("forgotpassword", { title: "Forgot Password" });
export const dashboardPage = async (req, res) => {
  if (!req.session.userId) return res.redirect("/login");

  // Prefer the session-declared role for fast redirect when DB is slow/unavailable
  if (req.session.userRole === 'admin') return res.redirect('/admin/dashboard');
  if (req.session.userRole === 'judge') return res.redirect('/judge/dashboard');

  try {
    const user = await User.findByPk(req.session.userId);
    if (user?.role === 'admin') {
      return res.redirect("/admin/dashboard");
    }
    return res.redirect("/judge/dashboard");
  } catch (error) {
    console.error("Dashboard lookup failed:", error);
    return res.redirect("/judge/dashboard");
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = (email || "").trim().toLowerCase();

    const defaultAdminEmail = (process.env.ADMIN_EMAIL || "admin@eventtabulation.com").trim().toLowerCase();
    const defaultAdminPassword = process.env.ADMIN_PASSWORD || "admin123";

    let adminUser = null;
    try {
      adminUser = await User.findOne({
        where: sequelize.where(
          sequelize.fn('LOWER', sequelize.col('email')),
          defaultAdminEmail
        )
      });
    } catch (lookupError) {
      console.error("Admin lookup failed:", lookupError);
    }

    if (normalizedEmail === defaultAdminEmail && password === defaultAdminPassword) {
      if (!adminUser) {
        const hashed = await bcrypt.hash(defaultAdminPassword, 10);
        adminUser = await User.create({
          name: process.env.ADMIN_NAME || "System Administrator",
          email: defaultAdminEmail,
          password: hashed,
          role: "admin",
          isActive: true
        });
      } else if (adminUser.role !== "admin" || !adminUser.isActive) {
        await adminUser.update({ role: "admin", isActive: true });
      }

      req.session.userId = adminUser.id;
      req.session.userRole = "admin";
      
      // Force session save before redirect
      return req.session.save((err) => {
        if (err) {
          console.error("Session save error:", err);
          req.flash("error_msg", "Session error. Please try again.");
          return res.redirect("/login");
        }
        logActivity("LOGIN", `User ${adminUser.name} logged in`, adminUser.id);
        return res.redirect("/admin/dashboard");
      });
    }

    const user = await User.findOne({
      where: sequelize.where(
        sequelize.fn('LOWER', sequelize.col('email')),
        normalizedEmail
      )
    });

    if (!user) {
      req.flash("error_msg", "User not found");
      return res.redirect("/login");
    }

    if (!user.isActive) {
      req.flash("error_msg", "Account is inactive");
      return res.redirect("/login");
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      req.flash("error_msg", "Incorrect password");
      return res.redirect("/login");
    }

    req.session.userId = user.id;
    req.session.userRole = user.role;
    
    // Force session save before redirect
    req.session.save((err) => {
      if (err) {
        console.error("Session save error:", err);
        req.flash("error_msg", "Session error. Please try again.");
        return res.redirect("/login");
      }
      logActivity("LOGIN", `User ${user.name} logged in`, user.id);
      
      if (user.role === 'admin') {
        res.redirect("/admin/dashboard");
      } else {
        res.redirect("/judge/dashboard");
      }
    });
  } catch (error) {
    console.error("Login failed:", error);
    req.flash("error_msg", "Login failed. Please verify the Supabase database connection.");
    res.redirect("/login");
  }
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const normalizedEmail = (email || "").trim().toLowerCase();

    const existingUser = await User.findOne({
      where: sequelize.where(
        sequelize.fn('LOWER', sequelize.col('email')),
        normalizedEmail
      )
    });

    if (existingUser) {
      req.flash("error_msg", "Email already exists");
      return res.redirect("/register");
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email: normalizedEmail, password: hashed, role: 'judge' });
    req.session.userId = user.id;
    req.session.userRole = user.role;
    logActivity("REGISTER", `New user registered: ${user.name}`, user.id);
    res.redirect("/judge/dashboard");
  } catch (error) {
    req.flash("error_msg", "Registration failed");
    res.redirect("/register");
  }
};

export const logoutUser = async (req, res) => {
  if (req.session.userId) {
    logActivity("LOGOUT", "User logged out", req.session.userId);
  }
  req.session.destroy();
  res.redirect("/login");
};
