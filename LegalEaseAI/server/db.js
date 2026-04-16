import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'database.json');

// Initialize JSON database
if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(dbPath, JSON.stringify({ users: [] }, null, 2));
}

const readDb = () => JSON.parse(fs.readFileSync(dbPath, 'utf8'));
const writeDb = (data) => fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));

const db = {
  prepare: (queryStr) => {
    // We only have simple SELECTs, INSERTs, UPDATEs in authController.js
    // We can simulate the required methods: get, run
    return {
      get: (email) => {
        const data = readDb();
        if (queryStr.includes('SELECT *')) {
          return data.users.find(u => u.email === email);
        } else if (queryStr.includes('SELECT id')) {
          const u = data.users.find(u => u.email === email);
          return u ? { id: u.id } : undefined;
        }
      },
      run: (...args) => {
        const data = readDb();
        const nextId = data.users.length > 0 ? Math.max(...data.users.map(u => u.id)) + 1 : 1;
        
        if (queryStr.includes('INSERT INTO users (email, password)')) {
          const [email, password] = args;
          data.users.push({ id: nextId, email, password, googleId: null, role: 'user' });
          writeDb(data);
          return { lastInsertRowid: nextId };
        } else if (queryStr.includes('INSERT INTO users (email, googleId)')) {
          const [email, googleId] = args;
          data.users.push({ id: nextId, email, password: null, googleId, role: 'user' });
          writeDb(data);
          return { lastInsertRowid: nextId };
        } else if (queryStr.includes('UPDATE users SET googleId')) {
          const [googleId, id] = args;
          const userIndex = data.users.findIndex(u => u.id === id);
          if (userIndex !== -1) {
            data.users[userIndex].googleId = googleId;
            writeDb(data);
          }
          return { changes: 1 };
        }
      }
    };
  }
};

export default db;
