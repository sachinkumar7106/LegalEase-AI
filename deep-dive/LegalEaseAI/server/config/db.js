import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import './loadEnv.js';
import { mockUsers, mockCases, mockDocuments, mockChats } from './mockDB.js';

const DATA_FILE = "c:/Users/trex2/Potential-Gold/LegalEase-AI/LegalEase-AI/LegalEaseAI/server/mockData.json";

const loadLocalData = () => {
  if (fs.existsSync(DATA_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
      // Clear current to avoid duplicates on reload
      mockUsers.length = 0;
      mockCases.length = 0;
      mockDocuments.length = 0;
      mockChats.length = 0;
      
      mockUsers.push(...(data.users || []));
      mockCases.push(...(data.cases || []));
      mockDocuments.push(...(data.documents || []));
      mockChats.push(...(data.chats || []));
      console.log(`📦 Loaded ${mockUsers.length} users and ${mockChats.length} chats from disk`);
    } catch (e) {
      console.error('Failed to load local mock data:', e.message);
    }
  }
};

const saveLocalData = () => {
  try {
    const data = { users: mockUsers, cases: mockCases, documents: mockDocuments, chats: mockChats };
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    console.log('💾 Mock data synced to disk');
  } catch (e) {
    console.error('Failed to save local mock data:', e.message);
  }
};

// Sync mockDB changes to disk
global.saveMockData = saveLocalData;

const connectDB = async () => {
  try {
    mongoose.set('strictQuery', true);
    const mongoUri = process.env.MONGO_URI?.trim();

    if (!mongoUri) {
      throw new Error('MONGO_URI missing');
    }

    console.log('Attempting to connect to MongoDB Atlas...');
    const conn = await mongoose.connect(mongoUri, { 
      serverSelectionTimeoutMS: 10000, // Increase to 10s
      connectTimeoutMS: 10000,
    });
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    global.useMockDB = false;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    if (error.message.includes('ECONNREFUSED')) {
      console.log('💡 TIP: This looks like a DNS/SRV issue. Check your firewall or use a standard connection string.');
    } else if (error.message.includes('Authentication failed')) {
      console.log('💡 TIP: Check your database username and password.');
    }
    console.log('⚠️ Falling back to PERSISTENT mock database (mockData.json)...');
    global.useMockDB = true;
    loadLocalData();
  }
};

export default connectDB;
