/*
MIT License

Copyright (c) 2025 Christian I. Cabrera || XianFire Framework
Mindoro State University - Philippines
*/

import dotenv from "dotenv";
import { sequelize } from "./models/db.js";
import "./models/relationships.js";

dotenv.config();

const railwaySetup = async () => {
  try {
    console.log("🚂 Railway Setup Starting...");
    
    // Test database connection
    console.log("🔗 Testing database connection...");
    await sequelize.authenticate();
    console.log("✅ Database connection successful!");
    
    // Run migrations (create/update tables)
    console.log("📊 Running database migrations...");
    await sequelize.sync({ alter: true });
    console.log("✅ Database tables created/updated!");
    
    console.log("\n✅ Railway setup completed successfully!");
    console.log("📝 Next: The seed script will run automatically to create default accounts");
    
  } catch (error) {
    console.error("❌ Railway setup failed:", error);
    console.error("\n🔍 Troubleshooting:");
    console.error("1. Ensure MySQL service is added to your Railway project");
    console.error("2. Check that environment variables are set correctly");
    console.error("3. Verify database credentials in Railway dashboard");
    process.exitCode = 1;
  } finally {
    await sequelize.close();
    process.exit();
  }
};

railwaySetup();
