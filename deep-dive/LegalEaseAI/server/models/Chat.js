import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // Store email or user ID
  title: { type: String, required: true },
  preview: { type: String },
  date: { type: String },
  messages: [
    {
      role: { type: String, enum: ['user', 'ai'], required: true },
      text: { type: String, required: true },
      hidden: { type: Boolean, default: false },
      date: { type: Date, default: Date.now }
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Chat', chatSchema);
