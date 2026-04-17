import User from "../models/User.js";
import { hashPassword, normalizeEmail, signAuthToken, verifyPassword } from "../utils/auth.js";
import { mockUsers } from "../config/mockDB.js";

const toPublicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
});

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email, and password are required." });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters long." });
    }

    const normalizedEmail = normalizeEmail(email);
    let existingUser;
    
    if (global.useMockDB) {
      existingUser = mockUsers.find(u => u.email === normalizedEmail);
    } else {
      existingUser = await User.findOne({ email: normalizedEmail });
    }

    if (existingUser) {
      return res.status(409).json({ error: "An account with this email already exists." });
    }

    let user;
    if (global.useMockDB) {
      user = {
        _id: Date.now().toString(),
        name: name.trim(),
        email: normalizedEmail,
        passwordHash: hashPassword(password),
      };
      mockUsers.push(user);
      if (global.saveMockData) global.saveMockData();
    } else {
      user = await User.create({
        name: name.trim(),
        email: normalizedEmail,
        passwordHash: hashPassword(password),
      });
    }

    const token = signAuthToken(user);

    return res.status(201).json({
      message: "Signup successful.",
      token,
      user: toPublicUser(user),
    });
  } catch (error) {
    console.error("Signup error details:", {
      message: error.message,
      stack: error.stack,
      body: req.body
    });
    return res.status(500).json({ error: "Unable to create account. Please contact support or try again later." });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const normalizedEmail = normalizeEmail(email);
    let user;
    
    if (global.useMockDB) {
      user = mockUsers.find(u => u.email === normalizedEmail);
    } else {
      user = await User.findOne({ email: normalizedEmail });
    }

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const isValid = verifyPassword(password, user.passwordHash);

    if (!isValid) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const token = signAuthToken(user);

    return res.status(200).json({
      message: "Login successful.",
      token,
      user: toPublicUser(user),
    });
  } catch (error) {
    console.error("Login error details:", {
      message: error.message,
      stack: error.stack,
      email: req.body?.email
    });
    return res.status(500).json({ error: "Unable to log in. Please check your connection and try again." });
  }
};

export const me = async (req, res) => {
  try {
    if (!req.auth?.user) {
      return res.status(401).json({ error: "Authentication required." });
    }

    return res.status(200).json({
      user: toPublicUser(req.auth.user),
    });
  } catch (error) {
    console.error("Session lookup error:", error.message);
    return res.status(500).json({ error: "Unable to verify session right now." });
  }
};
