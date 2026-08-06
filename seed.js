
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
import dotenv from "dotenv";
import { sequelize } from "./models/db.js";
import "./models/relationships.js";
import { User } from "./models/relationships.js";

dotenv.config();

const seed = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Connected to database");

    const adminEmail = (process.env.ADMIN_EMAIL || "admin@eventtabulation.com").trim().toLowerCase();
    const adminPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || "admin123", 10);
    const [admin, adminCreated] = await User.findOrCreate({
      where: { email: adminEmail },
      defaults: {
        name: process.env.ADMIN_NAME || "System Administrator",
        email: adminEmail,
        password: adminPassword,
        role: "admin",
        isActive: true
      }
    });
    if (adminCreated) {
      console.log(`✅ Admin account created - Email: ${adminEmail}, Password: ${process.env.ADMIN_PASSWORD || "admin123"}`);
    } else {
      console.log("ℹ️  Admin account already exists");
    }

    // Create Judge Accounts
    const judge1Password = await bcrypt.hash("judge123", 10);
    const [judge1, judge1Created] = await User.findOrCreate({
      where: { email: "judge1@eventtabulation.com" },
      defaults: {
        name: "Judge One",
        email: "judge1@eventtabulation.com",
        password: judge1Password,
        role: "judge",
        isActive: true
      }
    });
    if (judge1Created) {
      console.log("✅ Judge 1 account created - Email: judge1@eventtabulation.com, Password: judge123");
    }

    const judge2Password = await bcrypt.hash("judge123", 10);
    const [judge2, judge2Created] = await User.findOrCreate({
      where: { email: "judge2@eventtabulation.com" },
      defaults: {
        name: "Judge Two",
        email: "judge2@eventtabulation.com",
        password: judge2Password,
        role: "judge",
        isActive: true
      }
    });
    if (judge2Created) {
      console.log("✅ Judge 2 account created - Email: judge2@eventtabulation.com, Password: judge123");
    }

    const judge3Password = await bcrypt.hash("judge123", 10);
    const [judge3, judge3Created] = await User.findOrCreate({
      where: { email: "judge3@eventtabulation.com" },
      defaults: {
        name: "Judge Three",
        email: "judge3@eventtabulation.com",
        password: judge3Password,
        role: "judge",
        isActive: true
      }
    });
    if (judge3Created) {
      console.log("✅ Judge 3 account created - Email: judge3@eventtabulation.com, Password: judge123");
    }

    console.log("\n✅ Seeding completed!");
    console.log("\n📋 Login Credentials:");
    console.log("Admin: admin@eventtabulation.com / admin123");
    console.log("Judge 1: judge1@eventtabulation.com / judge123");
    console.log("Judge 2: judge2@eventtabulation.com / judge123");
    console.log("Judge 3: judge3@eventtabulation.com / judge123");

  } catch (error) {
    console.error("❌ Seeding failed:", error);
  } finally {
    await sequelize.close();
    process.exit();
  }
};

seed();
