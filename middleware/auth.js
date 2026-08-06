
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
import { User } from "../models/userModel.js";

export const requireAuth = async (req, res, next) => {
  if (!req.session.userId) {
    req.flash("error_msg", "Please login to access this page");
    return res.redirect("/login");
  }

  try {
    const user = await User.findByPk(req.session.userId);
    if (!user || !user.isActive) {
      req.session.destroy();
      req.flash("error_msg", "Account is inactive or not found");
      return res.redirect("/login");
    }

    req.user = user;
    res.locals.user = user;
    return next();
  } catch (error) {
    console.error("Auth lookup failed:", error);
    req.user = { id: req.session.userId, role: req.session.userRole || "judge" };
    res.locals.user = req.user;
    return next();
  }
};

export const requireAdmin = async (req, res, next) => {
  if (!req.session.userId) {
    req.flash("error_msg", "Please login to access this page");
    return res.redirect("/login");
  }

  // Fast path: if the session already declares admin role, trust it (helps when DB is slow)
  if (req.session.userRole === 'admin') {
    req.user = { id: req.session.userId, role: 'admin' };
    res.locals.user = req.user;
    return next();
  }

  try {
    const user = await User.findByPk(req.session.userId);
    if (!user || user.role !== 'admin') {
      req.flash("error_msg", "Admin access required");
      return res.redirect("/dashboard");
    }

    req.user = user;
    res.locals.user = user;
    return next();
  } catch (error) {
    console.error("Admin auth lookup failed:", error);
    req.flash("error_msg", "Admin access required");
    return res.redirect("/dashboard");
  }
};

export const requireJudge = async (req, res, next) => {
  if (!req.session.userId) {
    req.flash("error_msg", "Please login to access this page");
    return res.redirect("/login");
  }

  try {
    const user = await User.findByPk(req.session.userId);
    if (!user || user.role !== 'judge') {
      req.flash("error_msg", "Judge access required");
      return res.redirect("/dashboard");
    }

    req.user = user;
    res.locals.user = user;
    return next();
  } catch (error) {
    console.error("Judge auth lookup failed:", error);
    if (req.session.userRole === 'judge') {
      req.user = { id: req.session.userId, role: 'judge' };
      res.locals.user = req.user;
      return next();
    }

    req.flash("error_msg", "Judge access required");
    return res.redirect("/dashboard");
  }
};
