
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
    
import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const decodeEnvValue = (value) => {
  if (typeof value !== "string") return value;
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};

const normalizeDatabaseUrl = (url) => {
  if (!url) return url;

  let normalized = url.replace(/^postgres:\/\//, "postgresql://");

  if (normalized.includes("pooler.supabase.com") && !normalized.includes("pgbouncer=")) {
    normalized += normalized.includes("?") ? "&" : "?";
    normalized += "sslmode=require&pgbouncer=true";
  } else if (normalized.includes("supabase") && !normalized.includes("sslmode=")) {
    normalized += normalized.includes("?") ? "&" : "?";
    normalized += "sslmode=require";
  }

  return normalized;
};

const useSupabase = Boolean(process.env.DATABASE_URL || process.env.DB_HOST);
const database = process.env.DB_NAME || "postgres";
const username = process.env.DB_USER || "root";
const password = decodeEnvValue(process.env.DB_PASSWORD || "");
const host = process.env.DB_HOST || "localhost";
const port = Number(process.env.DB_PORT || (useSupabase ? 5432 : 3306));
const dialect = process.env.DB_DIALECT || (useSupabase ? "postgres" : "mysql");
const sslEnabled =
  process.env.DB_SSL === "true" ||
  process.env.DATABASE_URL?.includes("supabase") ||
  process.env.DB_HOST?.includes("supabase");

const sequelizeOptions = {
  host,
  port,
  dialect,
  logging: false,
  pool: {
    max: 5,
    min: 0,
    idle: 10000,
    acquire: 5000
  },
  retry: {
    max: 3,
    backoffBase: 1000,
    backoffExponent: 1.5
  },
  dialectOptions: sslEnabled
    ? {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      }
    : undefined
};

// Allow an explicit direct connection override. Use direct URI when provided.
const databaseUrl = process.env.DIRECT_DATABASE_URL
  ? process.env.DIRECT_DATABASE_URL
  : normalizeDatabaseUrl(process.env.DATABASE_URL);

console.log(`[DB] Connecting to ${host} as ${username} (${dialect})`);
console.log(`[DB] Using DATABASE_URL: ${Boolean(databaseUrl)}`);
console.log(`[DB] Host is Supabase pooler: ${host.includes("pooler.supabase.com")}`);

export const sequelize = databaseUrl
  ? new Sequelize(databaseUrl, sequelizeOptions)
  : new Sequelize(database, username, password, sequelizeOptions);