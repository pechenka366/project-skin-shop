import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const MONGO_URI = 'mongodb+srv://alexayax366_db_user:P3rffuqn.366957@skinshop.esfe896.mongodb.net/shop';

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

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
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});