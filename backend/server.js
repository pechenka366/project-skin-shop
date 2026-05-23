import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcryptjs";
import passport from "./passport.js";
import User from "./models/User.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../frontend/dist/img/products/"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "product-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
});

const isAdmin = async (req, res, next) => {
  try {
    const userId = req.query.userId || req.body.userId;

    console.log("isAdmin проверка, userId:", userId);

    if (!userId) {
      console.log("userId не передан");
      return res.status(401).json({ message: "Не авторизован" });
    }

    const user = await User.findById(userId);
    console.log("Найден пользователь:", user?.email, "role:", user?.role);

    if (!user || user.role !== "admin") {
      console.log("Доступ запрещён: роль не admin");
      return res.status(403).json({ message: "Доступ запрещён" });
    }

    console.log("Доступ разрешён");
    next();
  } catch (err) {
    console.error("Ошибка в isAdmin:", err);
    res.status(500).json({ message: err.message });
  }
};

const productSchema = new mongoose.Schema({
  name: { type: String, default: "" },
  title: { type: String, default: "" },
  price: { type: Number, default: 0 },
  images: [{ type: String }],
  description: { type: String, default: "" },
  category: { type: String, default: "" },
  stock: { type: Number, default: 0 },
  features: [{ type: String }],
  materials: [{ type: String }],
  size: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
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

// Нормализация номера телефона к формату +7XXXXXXXXXX
const normalizePhone = (phone) => {
  if (!phone) return phone;
  // Удаляем все пробелы, дефисы, скобки
  let cleaned = phone.replace(/[\s\-\(\)]/g, "");

  // Если номер начинается с 8, заменяем на +7
  if (cleaned.startsWith("8")) {
    cleaned = "+7" + cleaned.slice(1);
  }
  // Если номер начинается с 7 (без +), добавляем +
  else if (cleaned.startsWith("7") && !cleaned.startsWith("+7")) {
    cleaned = "+7" + cleaned.slice(1);
  }
  // Если номер начинается с 9 (10 цифр без кода страны)
  else if (cleaned.length === 10 && /^\d{10}$/.test(cleaned)) {
    cleaned = "+7" + cleaned;
  }

  return cleaned;
};

// ========== ПУБЛИЧНЫЕ МАРШРУТЫ ==========
app.get("/api/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Товар не найден" });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

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
    const { name, email, phone, password } = req.body;

    let normalizedPhone = null;
    if (phone) {
      normalizedPhone = normalizePhone(phone);

      const existingPhone = await User.findOne({ phone: normalizedPhone });
      if (existingPhone) {
        return res.status(400).json({
          message: "Пользователь с таким номером телефона уже существует",
        });
      }
    }

    if (email && !isValidEmail(email)) {
      return res.status(400).json({ message: "Введите корректный email" });
    }

    if (email) {
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        return res
          .status(400)
          .json({ message: "Пользователь с таким email уже существует" });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      phone: normalizedPhone,
      password: hashedPassword,
    });
    await user.save();

    res.status(201).json({
      message: "Регистрация успешна",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email || "",
        phone: user.phone || "",
        avatar: user.avatar || "",
        role: user.role || "user",
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, phone, password } = req.body;

    let user = null;

    if (email) {
      user = await User.findOne({ email });
    } else if (phone) {
      const normalizedPhone = normalizePhone(phone);
      user = await User.findOne({ phone: normalizedPhone });
    }

    if (!user) {
      return res.status(400).json({ message: "Пользователь не найден" });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(400).json({ message: "Неверный пароль" });
    }

    res.json({
      message: "Вход успешен",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email || "",
        phone: user.phone || "",
        avatar: user.avatar || "",
        role: user.role || "user",
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ========== OAuth МАРШРУТЫ ==========
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { session: false }),
  async (req, res) => {
    const user = req.user;
    res.redirect(
      `https://bahtarma.ru/auth-success?id=${user._id}&name=${encodeURIComponent(user.name)}&email=${user.email}&role=${user.role || "user"}`,
    );
  },
);

app.get("/auth/vk", passport.authenticate("vkontakte"));

app.get(
  "/auth/vk/callback",
  passport.authenticate("vkontakte", { failureRedirect: "/login" }),
  async (req, res) => {
    const user = req.user;
    res.redirect(
      `https://bahtarma.ru/auth-success?id=${user._id}&name=${encodeURIComponent(user.name)}&email=${user.email}&role=${user.role || "user"}`,
    );
  },
);

app.get("/auth/yandex", passport.authenticate("yandex"));

app.get(
  "/auth/yandex/callback",
  passport.authenticate("yandex", {
    session: false,
    failureRedirect: "/login",
  }),
  async (req, res) => {
    const user = req.user;
    res.redirect(
      `https://bahtarma.ru/auth-success?id=${user._id}&name=${encodeURIComponent(user.name)}&email=${user.email}&role=${user.role || "user"}`,
    );
  },
);

// ========== ПРОФИЛЬ ПОЛЬЗОВАТЕЛЯ ==========
app.put("/api/users/:userId", async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;
    if (phone !== undefined) {
      user.phone = normalizePhone(phone);
    }

    await user.save();

    res.json({
      message: "Профиль обновлён",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.put("/api/users/:userId/password", async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      return res.status(400).json({ message: "Неверный текущий пароль" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Пароль успешно изменён" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ========== ЗАГРУЗКА ФАЙЛОВ ==========
app.post(
  "/api/upload/products",
  isAdmin,
  upload.array("images", 10),
  (req, res) => {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "Файлы не загружены" });
    }

    const urls = req.files.map((file) => `/img/products/${file.filename}`);
    res.json({ urls });
  },
);

app.post("/api/upload", isAdmin, upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Файл не загружен" });
  }
  res.json({ url: `/img/products/${req.file.filename}` });
});

// ========== АДМИН-МАРШРУТЫ ==========
app.get("/api/admin/users", isAdmin, async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.put("/api/admin/users/:userId", isAdmin, async (req, res) => {
  try {
    const { name, email, phone, role } = req.body;
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;
    if (phone !== undefined) user.phone = normalizePhone(phone);
    if (role !== undefined) user.role = role;

    await user.save();
    res.json({
      message: "Пользователь обновлён",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.delete("/api/admin/users/:userId", isAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.userId);
    res.json({ message: "Пользователь удалён" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/api/admin/products", isAdmin, async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/api/admin/products", isAdmin, async (req, res) => {
  try {
    const {
      name,
      title,
      price,
      images,
      description,
      category,
      stock,
      features,
      materials,
      size,
    } = req.body;
    const product = new Product({
      name,
      title,
      price,
      images,
      description,
      category,
      stock,
      features: features || [],
      materials: materials || [],
      size: size || "",
    });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.error("Ошибка создания товара:", err);
    res.status(400).json({ message: err.message });
  }
});

app.put("/api/admin/products/:id", isAdmin, async (req, res) => {
  try {
    const {
      name,
      title,
      price,
      images,
      description,
      category,
      stock,
      features,
      materials,
      size,
    } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Товар не найден" });
    }

    if (name !== undefined) product.name = name;
    if (title !== undefined) product.title = title;
    if (price !== undefined) product.price = price;
    if (images !== undefined) product.images = images;
    if (description !== undefined) product.description = description;
    if (category !== undefined) product.category = category;
    if (stock !== undefined) product.stock = stock;
    if (features !== undefined) product.features = features;
    if (materials !== undefined) product.materials = materials;
    if (size !== undefined) product.size = size;

    await product.save();
    res.json(product);
  } catch (err) {
    console.error("Ошибка обновления товара:", err);
    res.status(400).json({ message: err.message });
  }
});

app.delete("/api/admin/products/:id", isAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Товар не найден" });
    }
    res.json({ message: "Товар удалён" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ========== ЗАПУСК СЕРВЕРА ==========
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Установка пароля для пользователей без пароля (вошли через соцсети)
app.post("/api/users/:userId/set-password", async (req, res) => {
  try {
    const { newPassword } = req.body;
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    if (user.password) {
      return res.status(400).json({
        message: "У вас уже есть пароль. Используйте раздел смены пароля.",
      });
    }

    if (!newPassword || newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "Пароль должен быть не менее 6 символов" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({
      message:
        "Пароль успешно установлен! Теперь вы можете входить по email/паролю.",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Схема категории
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, default: "" },
  image: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

const Category = mongoose.model("Category", categorySchema);

// ========== МАРШРУТЫ ДЛЯ КАТЕГОРИЙ ==========

// Получить все категории (публичный)
app.get("/api/categories", async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Получить товары по категории
app.get("/api/products/category/:slug", async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    if (!category) {
      return res.status(404).json({ message: "Категория не найдена" });
    }
    const products = await Product.find({ category: category.name });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ========== АДМИН-МАРШРУТЫ ДЛЯ КАТЕГОРИЙ ==========

// Получить все категории (админ)
app.get("/api/admin/categories", isAdmin, async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Создать категорию
app.post("/api/admin/categories", isAdmin, async (req, res) => {
  try {
    const { name, description, image } = req.body;
    const slug = name.toLowerCase().replace(/[^a-zа-яё0-9]+/g, '-');
    const category = new Category({ name, slug, description, image });
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Обновить категорию
app.put("/api/admin/categories/:id", isAdmin, async (req, res) => {
  try {
    const { name, description, image } = req.body;
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Категория не найдена" });
    }
    if (name) {
      category.name = name;
      category.slug = name.toLowerCase().replace(/[^a-zа-яё0-9]+/g, '-');
    }
    if (description !== undefined) category.description = description;
    if (image !== undefined) category.image = image;
    await category.save();
    res.json(category);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Удалить категорию
app.delete("/api/admin/categories/:id", isAdmin, async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: "Категория удалена" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});