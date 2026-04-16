import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import db from '../db.js';
import dotenv from 'dotenv';
dotenv.config();

const SECRET = process.env.JWT_SECRET || 'fallback_secret_for_development_only';
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || 'dummy_client_id');

export const register = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  try {
    const checkUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (checkUser) return res.status(400).json({ error: 'User already exists' });

    const hash = await bcrypt.hash(password, 10);
    const stmt = db.prepare('INSERT INTO users (email, password) VALUES (?, ?)');
    const info = stmt.run(email, hash);

    const token = jwt.sign({ id: info.lastInsertRowid, email, role: 'user' }, SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: info.lastInsertRowid, email } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error while registering' });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  try {
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    
    if (!user.password && user.googleId) {
      return res.status(401).json({ error: 'Please login with Google.' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, email, role: 'user' }, SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user.id, email } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error during login' });
  }
};

export const googleLogin = async (req, res) => {
  const { credential } = req.body; // Token from frontend GoogleLogin
  if (!credential) return res.status(400).json({ error: 'Google credential is required' });

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: credential
    });
    
    const payload = ticket.getPayload();
    const { email, sub: googleId } = payload;

    let user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    
    if (!user) {
      const stmt = db.prepare('INSERT INTO users (email, googleId) VALUES (?, ?)');
      const info = stmt.run(email, googleId);
      user = { id: info.lastInsertRowid, email, googleId };
    } else if (!user.googleId) {
      db.prepare('UPDATE users SET googleId = ? WHERE id = ?').run(googleId, user.id);
    }

    const jwtToken = jwt.sign({ id: user.id, email, role: 'user' }, SECRET, { expiresIn: '1d' });
    res.json({ token: jwtToken, user: { id: user.id, email } });
  } catch (error) {
    console.error('Google verification error:', error);
    res.status(401).json({ error: 'Invalid Google token' });
  }
};
