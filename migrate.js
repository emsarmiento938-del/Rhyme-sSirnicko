
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
    
import dotenv from "dotenv";
import { sequelize as defaultSequelize } from "./models/db.js";
import "./models/relationships.js";
import { Sequelize } from "sequelize";
import bcrypt from "bcrypt";

dotenv.config();

const tryMigrate = async (seq, label) => {
  try {
    console.log(`[MIGRATE] Trying ${label} connection...`);
    await seq.authenticate();
    console.log(`✅ Connected using ${label} connection`);
    await seq.sync({ alter: true });
    console.log(`✅ Tables created or updated using ${label} connection`);
    // Ensure default admin account exists (works with any Sequelize instance)
    try {
      const adminEmail = (process.env.ADMIN_EMAIL || "admin@eventtabulation.com").trim().toLowerCase();
      const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
      const adminName = process.env.ADMIN_NAME || "System Administrator";

      // Lookup existing user by lowercased email
      const [rows] = await seq.query(
        'SELECT id, role, "isActive" FROM "Users" WHERE lower(email)=:email LIMIT 1',
        { replacements: { email: adminEmail }, raw: true }
      );

      if (rows && rows.id) {
        const needUpdate = rows.role !== 'admin' || rows.isActive === false;
        if (needUpdate) {
          await seq.query(
            'UPDATE "Users" SET role=:role, "isActive"=true, name=:name WHERE id=:id',
            { replacements: { role: 'admin', name: adminName, id: rows.id } }
          );
          console.log(`✅ Updated existing admin user: ${adminEmail}`);
        } else {
          console.log(`✅ Admin user already present: ${adminEmail}`);
        }
      } else {
        const hashed = await bcrypt.hash(adminPassword, 10);
        await seq.query(
          'INSERT INTO "Users" (name, email, password, role, "isActive", "createdAt", "updatedAt") VALUES (:name, :email, :password, :role, true, now(), now())',
          { replacements: { name: adminName, email: adminEmail, password: hashed, role: 'admin' } }
        );
        console.log(`✅ Default admin account created: ${adminEmail}`);
      }
    } catch (adminErr) {
      console.error('Failed to ensure default admin account:', adminErr && adminErr.message ? adminErr.message : adminErr);
    }

    await seq.close();
    return true;
  } catch (err) {
    console.error(`[MIGRATE] ${label} connection failed:`, err && err.message ? err.message : err);
    try { await seq.close(); } catch (e) {}
    return false;
  }
};

let migrated = false;

// First try the default (usually pooler-based) connection
migrated = await tryMigrate(defaultSequelize, 'DEFAULT');

// If that failed and there is a DIRECT_DATABASE_URL, try that next
if (!migrated && process.env.DIRECT_DATABASE_URL) {
  const directSeq = new Sequelize(process.env.DIRECT_DATABASE_URL, defaultSequelize.options);
  migrated = await tryMigrate(directSeq, 'DIRECT');
}

if (!migrated) {
  console.error('❌ Migration failed: no available DB connections');
  process.exitCode = 1;
} else {
  process.exit(0);
}

