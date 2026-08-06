/*
MIT License

Copyright (c) 2025 Christian I. Cabrera || XianFire Framework
Mindoro State University - Philippines
*/

import mysql from "mysql2/promise";
import dotenv from "dotenv";
import { sequelize } from "./models/db.js";
import "./models/relationships.js";

dotenv.config();

const setupDatabase = async () => {
  let connection;
  
  try {
    // Connect to MySQL without specifying a database
    console.log("🔌 Connecting to MySQL...");
    connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: ""
    });
    
    // Create database if it doesn't exist
    console.log("🗄️  Creating database 'eventtabulationsys'...");
    await connection.query("CREATE DATABASE IF NOT EXISTS eventtabulationsys");
    console.log("✅ Database 'eventtabulationsys' created or already exists!");
    
    await connection.end();
    
    // Now connect with Sequelize and sync models
    console.log("🔗 Connecting to database with Sequelize...");
    await sequelize.authenticate();
    console.log("✅ Connected to database!");
    
    console.log("📊 Creating/updating tables...");
    await sequelize.sync({ alter: true });
    console.log("✅ All tables created/updated successfully!");
    
    console.log("\n✅ Database setup completed!");
    console.log("\n📝 Next step: Run 'npm run seed' to create admin and judge accounts");
    
  } catch (error) {
    console.error("❌ Database setup failed:", error);
    process.exitCode = 1;
  } finally {
    if (connection) {
      await connection.end();
    }
    await sequelize.close();
    process.exit();
  }
};

setupDatabase();
