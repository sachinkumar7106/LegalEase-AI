import mongoose from 'mongoose';
import './loadEnv.js';

const connectDB = async () => {
  try {
    mongoose.set('strictQuery', true);

    const mongoUri = process.env.MONGO_URI?.trim();

    if (!mongoUri) {
      throw new Error('MONGO_URI is missing. Add it to LegalEaseAI/.env or server/.env before starting the backend.');
    }

    console.log('Attempting to connect to MongoDB Atlas...');
    const conn = await mongoose.connect(mongoUri);
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};


export default connectDB;
