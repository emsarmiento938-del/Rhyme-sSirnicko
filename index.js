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
    
import express from "express";
import path from "path";
import session from "express-session";
import flash from "connect-flash";
import router from "./routes/index.js";
import fs from 'fs';
import hbs from "hbs";
import { fileURLToPath } from "url";
import { dirname } from "path";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(process.cwd(), "public")));

app.use(session({
  secret: process.env.SESSION_SECRET || "xianfire-secret-key",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));
app.use(flash());

app.engine("xian", async (filePath, options, callback) => {
  try {
     const originalPartialsDir = hbs.partialsDir;
    hbs.partialsDir = path.join(__dirname, 'views');

    const result = await new Promise((resolve, reject) => {
      hbs.__express(filePath, options, (err, html) => {
        if (err) return reject(err);
        resolve(html);
      });
    });

    hbs.partialsDir = originalPartialsDir;
    callback(null, result);
  } catch (err) {
    callback(err);
  }
});
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  next();
});


app.set("views", path.join(__dirname, "views"));
app.set("view engine", "xian");
const partialsDir = path.join(__dirname, "views/partials");
try {
  const files = fs.readdirSync(partialsDir);
  files
    .filter(file => file.endsWith('.xian'))
    .forEach(file => {
      const partialName = file.replace('.xian', '');
      const fullPath = path.join(partialsDir, file);
      try {
        const content = fs.readFileSync(fullPath, 'utf8');
        hbs.registerPartial(partialName, content);
      } catch (err) {
        console.error(`❌ Failed to read partial: ${file}`, err);
      }
    });
} catch (err) {
  console.error("❌ Could not read partials directory:", err);
}

// Register Handlebars helpers
hbs.registerHelper('eq', function(a, b) {
  return a === b;
});

hbs.registerHelper('concat', function(...args) {
  args.pop(); // Remove the options object
  return args.join('');
});

hbs.registerHelper('add', function(a, b) {
  return a + b;
});

// Increment helper: returns value + 1 (useful for 1-based indexes)
hbs.registerHelper('inc', function(value) {
  const n = Number(value);
  if (isNaN(n)) return value;
  return n + 1;
});

// Rank label helper: converts zero-based index into Winner / Runner-up / Nth Place
hbs.registerHelper('rankLabel', function(idx) {
  const i = Number(idx);
  if (isNaN(i)) return '';
  if (i === 0) return 'Winner';
  if (i === 1) return '1st Runner-up';
  if (i === 2) return '2nd Runner-up';
  if (i === 3) return '3rd Runner-up';
  // ordinal suffix for other places
  const n = i + 1;
  const j = n % 10,
        k = n % 100;
  let suffix = 'th';
  if (j === 1 && k !== 11) suffix = 'st';
  else if (j === 2 && k !== 12) suffix = 'nd';
  else if (j === 3 && k !== 13) suffix = 'rd';
  return `${n}${suffix} Place`;
});

hbs.registerHelper('lookup', function(obj, key) {
  return obj && obj[key];
});

hbs.registerHelper('includes', function(array, value) {
  return array && array.includes(value);
});

// Reduce helper: reduce an array of objects by a numeric property key
hbs.registerHelper('reduce', function(array, prop, initial) {
  try {
    if (!Array.isArray(array)) return initial || 0;
    // prop may be a string property name
    const start = Number(initial) || 0;
    return array.reduce((acc, item) => {
      const val = item && (prop in item ? Number(item[prop]) : Number(item));
      return acc + (isNaN(val) ? 0 : val);
    }, start);
  } catch (e) {
    return initial || 0;
  }
});

// Sum helper: simple numeric display/format helper
hbs.registerHelper('sum', function(value) {
  const n = Number(value) || 0;
  // return integer if whole, else fixed to 2 decimals
  return (n % 1 === 0) ? n : n.toFixed(2);
});

// Greater-than-or-equal helper
hbs.registerHelper('gte', function(a, b) {
  const na = Number(a);
  const nb = Number(b);
  if (isNaN(na) || isNaN(nb)) return false;
  return na >= nb;
});

// Less-than-or-equal helper
hbs.registerHelper('lte', function(a, b) {
  const na = Number(a);
  const nb = Number(b);
  if (isNaN(na) || isNaN(nb)) return false;
  return na <= nb;
});

// Index helper: retrieve array element by index
hbs.registerHelper('index', function(array, idx) {
  try {
    if (!array || !Array.isArray(array)) return '';
    const i = Number(idx);
    if (isNaN(i)) return '';
    return array[i] === undefined ? '' : array[i];
  } catch (e) {
    return '';
  }
});

// Get helper: retrieve nested property by dot-separated path from an object
hbs.registerHelper('get', function(obj, path) {
  try {
    if (obj == null || typeof path !== 'string') return '';
    const parts = path.split('.');
    let cur = obj;
    for (let p of parts) {
      if (cur == null) return '';
      cur = cur[p];
    }
    return (cur === undefined || cur === null) ? '' : cur;
  } catch (e) {
    return '';
  }
});

app.use("/", router);

export default app;

const startServer = (port) => {
  const server = app.listen(port, '0.0.0.0', () => {
    console.log('🔥 XianFire running at http://localhost:' + port);
    console.log('📡 Server listening on port ' + port);
  });

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.warn(`⚠️ Port ${port} is busy, trying ${port + 1}...`);
      server.close(() => startServer(port + 1));
    } else {
      console.error('❌ Failed to start server:', error);
      process.exit(1);
    }
  });
};

if (!process.env.ELECTRON) {
  startServer(PORT);
}
