import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,

  email: {
    type: String,
    unique: true,
    sparse: true,
  },

  password: String,

  googleId: String,
  vkId: String,
  yandexId: String,

  avatar: String,

  provider: String,
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model(
  "User",
  userSchema
);
