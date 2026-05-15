import mongoose from "mongoose";

const MONGO_URI = "mongodb+srv://alexayax366_db_user:P3rffuqn.366957@skinshop.esfe896.mongodb.net/shop";

async function testConnection() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Подключение успешно');

    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📁 Коллекции:', collections.map(c => c.name));

    await mongoose.disconnect();
  } catch (err) {
    console.error('❌ Ошибка подключения:', err.message);
  }
}

testConnection();