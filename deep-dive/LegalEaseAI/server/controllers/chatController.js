import { mockChats } from '../config/mockDB.js';
import Chat from '../models/Chat.js';

export const getChats = async (req, res) => {
  try {
    const userId = req.user.email;
    
    if (global.useMockDB) {
      const userChats = mockChats.filter(c => c.userId === userId);
      return res.json(userChats);
    }
    
    const userChats = await Chat.find({ userId }).sort({ createdAt: -1 });
    return res.json(userChats);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const saveChat = async (req, res) => {
  try {
    const userId = req.user.email;
    const { title, preview, date, messages } = req.body;
    
    if (global.useMockDB) {
      const newChat = {
        id: Date.now().toString(),
        userId,
        title,
        preview,
        date,
        messages
      };
      mockChats.push(newChat);
      if (global.saveMockData) global.saveMockData();
      return res.status(201).json(newChat);
    }
    
    const newChat = new Chat({
      userId,
      title,
      preview,
      date,
      messages
    });
    
    await newChat.save();
    return res.status(201).json(newChat);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
