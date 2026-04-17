import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const testConnect = async () => {
  const uri = "mongodb://prabhaka_db_leai:legalease_ai@ac-zusnicm-shard-00-00.hhze9zy.mongodb.net:27017,ac-zusnicm-shard-00-01.hhze9zy.mongodb.net:27017,ac-zusnicm-shard-00-02.hhze9zy.mongodb.net:27017/legalease?ssl=true&replicaSet=atlas-zusnicm-shard-0&authSource=admin";
  console.log('Testing connection to:', uri);
  
  try {
    await mongoose.connect(uri, { 
      serverSelectionTimeoutMS: 5000,
    });
    console.log('✅ Connection Successful!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Connection Failed:', err.message);
    process.exit(1);
  }
};

testConnect();
