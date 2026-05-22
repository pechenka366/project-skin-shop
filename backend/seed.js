import mongoose from 'mongoose';

const MONGO_URI = 'mongodb://localhost:27017/shop';

const products = [
  {
    name: 'Топовая сумка',
    title: 'Крутая работа',
    price: 25000,
    img: '/img/mainImg2.jpg'
  },
  {
    name: 'Дорожная сумка',
    title: 'Натуральная кожа, Италия',
    price: 24900,
    img: '/img/mainImg3.jpg'
  }
];

const productSchema = new mongoose.Schema({
  name: String,
  title: String,
  price: Number,
  img: String
});

const Product = mongoose.model('Product', productSchema);

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    await Product.insertMany(products);
    console.log('✅ Данные добавлены');
    process.exit(0);
  } catch (err) {
    console.error('❌ Ошибка:', err);
    process.exit(1);
  }
}

seed();