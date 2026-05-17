import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const MONGO_URI = 'mongodb+srv://alexayax366_db_user:P3rffuqn.366957@skinshop.esfe896.mongodb.net/shop';

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

const productSchema = new mongoose.Schema({
  name: String,
  title: String,
  price: Number,
  img: String
});

const Product = mongoose.model('Product', productSchema);

app.get('/', (req, res) => {
  res.send('API работает <a href="/api/products">/api/products</a>');
});

app.get('/api/products', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

app.post('/api/products', async (req, res) => {
  const product = new Product(req.body);
  await product.save();
  res.json(product);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

const cartItemSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  title: { type: String, required: true },
  price: { type: Number, required: true },
  img: { type: String, required: true },
  quantity: { type: Number, default: 1 }
});

const CartItem = mongoose.model('CartItem', cartItemSchema);

app.get('/api/cart', async (req, res) => {
  try {
    const cartItems = await CartItem.find();
    res.json(cartItems);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/cart', async (req, res) => {
  try {
    const { _id, name, title, price, img, quantity } = req.body;
    
    const existingItem = await CartItem.findOne({ _id });
    
    if (existingItem) {
      existingItem.quantity += 1;
      await existingItem.save();
      res.json(existingItem);
    } else {
      const newItem = new CartItem({ _id, name, title, price, img, quantity: quantity || 1 });
      await newItem.save();
      res.status(201).json(newItem);
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete('/api/cart/:id', async (req, res) => {
  try {
    await CartItem.deleteOne({ _id: req.params.id });
    res.json({ message: 'Товар удалён' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.put('/api/cart/:id', async (req, res) => {
  try {
    const { quantity } = req.body;
    const item = await CartItem.findOne({ _id: req.params.id });
    
    if (item) {
      item.quantity = quantity;
      await item.save();
      res.json(item);
    } else {
      res.status(404).json({ message: 'Товар не найден' });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});