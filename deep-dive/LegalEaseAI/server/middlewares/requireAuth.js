import User from "../models/User.js";
import { verifyAuthToken } from "../utils/auth.js";
import { mockUsers } from "../config/mockDB.js";

const extractToken = (req) => {
  const authHeader = req.headers.authorization || "";
  const [scheme, token] = authHeader.split(" ");

  if (scheme?.toLowerCase() === "bearer" && token) {
    return token;
  }

  return req.headers["x-auth-token"] || null;
};

const requireAuth = async (req, res, next) => {
  try {
    const token = extractToken(req);
    const payload = verifyAuthToken(token);

    if (!payload?.sub) {
      return res.status(401).json({ error: "Authentication required." });
    }

    let user;
    if (global.useMockDB) {
      user = mockUsers.find(u => u._id === payload.sub);
    } else {
      user = await User.findById(payload.sub);
    }

    if (!user) {
      return res.status(401).json({ error: "Authentication required." });
    }

    req.auth = {
      token,
      payload,
      user,
    };

    return next();
  } catch (error) {
    console.error("Auth middleware error:", error.message);
    return res.status(500).json({ error: "Unable to verify authentication." });
  }
};

export default requireAuth;
