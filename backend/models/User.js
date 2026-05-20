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
  avatar: { type: String, default: "" },
  phone: { type: String, default: "" },
  provider: String,

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("User", userSchema);
