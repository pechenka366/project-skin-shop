import dotenv from 'dotenv';
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcryptjs";
import passport from "./passport.js";
import User from "./models/User.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

const productSchema = new mongoose.Schema({
  name: String,
  title: String,
  price: Number,
  img: String,
});

const cartItemSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  productId: { type: String, required: true },
  name: { type: String, required: true },
  title: { type: String, required: true },
  price: { type: Number, required: true },
  img: { type: String, required: true },
  quantity: { type: Number, default: 1 },
});

const Product = mongoose.model("Product", productSchema);
const CartItem = mongoose.model("CartItem", cartItemSchema);

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/;
  return emailRegex.test(email);
};

app.get("/api/products", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

app.get("/api/cart/:userId", async (req, res) => {
  try {
    const items = await CartItem.find({ userId: req.params.userId });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/api/cart", async (req, res) => {
  try {
    const { userId, productId, name, title, price, img, quantity } = req.body;

    const existingItem = await CartItem.findOne({ userId, productId });
    if (existingItem) {
      existingItem.quantity += 1;
      await existingItem.save();
      res.json(existingItem);
    } else {
      const newItem = new CartItem({
        userId,
        productId,
        name,
        title,
        price,
        img,
        quantity,
      });
      await newItem.save();
      res.status(201).json(newItem);
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete("/api/cart/:userId/:productId", async (req, res) => {
  try {
    await CartItem.deleteOne({
      userId: req.params.userId,
      productId: req.params.productId,
    });
    res.json({ message: "Товар удалён" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Введите корректный email" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Пользователь с таким email уже существует" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    res.status(201).json({
      message: "Регистрация успешна",
      user: { _id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Пользователь не найден" });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(400).json({ message: "Неверный пароль" });
    }

    res.json({
      message: "Вход успешен",
      user: { _id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get(
  "/auth/google",

  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

app.get(
  "/auth/google/callback",

  passport.authenticate("google", {
    session: false,
  }),

  async (req, res) => {
    const user = req.user;

    res.redirect(
      `http://localhost:5173/auth-success?` +
      `id=${user._id}&` +
      `name=${encodeURIComponent(user.name)}&` +
      `email=${user.email}`
    );
  }
);

app.get('/auth/vk',
  passport.authenticate('vkontakte')
);

app.get('/auth/vk/callback',
  passport.authenticate('vkontakte', { session: false, failureRedirect: '/login' }),
  async (req, res) => {
    const user = req.user;
    res.redirect(
      `http://localhost:5173/auth-success?` +
      `id=${user._id}&` +
      `name=${encodeURIComponent(user.name)}&` +
      `email=${user.email}`
    );
  }
);

app.get('/auth/yandex',
  passport.authenticate('yandex')
);

app.get('/auth/yandex/callback',
  passport.authenticate('yandex', { session: false, failureRedirect: '/login' }),
  async (req, res) => {
    const user = req.user;
    res.redirect(
      `http://localhost:5173/auth-success?` +
      `id=${user._id}&` +
      `name=${encodeURIComponent(user.name)}&` +
      `email=${user.email}`
    );
  }
);

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
