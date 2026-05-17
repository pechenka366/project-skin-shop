import About from "./components/About";
import Header from "./components/Header";
import Main from "./components/Main";
import Catalog from "./components/Catalog";
import MaterialsBlock from "./components/materialsBlock";
import TraditionBlock from "./components/TraditionBlock";
import InfoBlock from "./components/InfoBlock";
import Notification from "./components/Notification";
import "./style/resert.css";
import "./App.css";
import { useEffect, useState } from "react";
import axios from "axios";

interface Product {
  _id: string;
  name: string;
  title: string;
  price: number;
  img: string;
}

interface CartItem extends Product {
  quantity: number;
}

interface NotificationState {
  message: string;
  type: "success" | "error" | "info";
  id: number;
}

function App() {
  const [isCartOpen, setIsCartOpen] = useState(true);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [notifications, setNotifications] = useState<NotificationState[]>([]); 

  const showNotification = (message: string, type: "success" | "error" | "info") => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { message, type, id }]);
  };

  const removeNotification = (id: number) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/products")
      .then((response) => setProducts(response.data))
      .catch((error) => console.error("Ошибка загрузки товаров:", error));
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/cart")
      .then((response) => setCartItems(response.data))
      .catch((error) => console.error("Ошибка загрузки корзины:", error));
  }, []);

  const addToCart = async (product: Product) => {
    console.log("Добавление в корзину:", product.name);
    try {
      const response = await axios.post("http://localhost:5000/api/cart", {
        _id: product._id,
        name: product.name,
        title: product.title,
        price: product.price,
        img: product.img,
        quantity: 1,
      });

      setCartItems((prev) => {
        const existing = prev.find((item) => item._id === product._id);
        if (existing) {
          showNotification(`Товар "${product.name}" добавлен в корзину`, "success"); 
          return prev.map((item) =>
            item._id === product._id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }
        showNotification(`Товар "${product.name}" добавлен в корзину`, "success"); 
        return [...prev, response.data];
      });

      console.log("Корзина после добавления:", cartItems.length + 1);
    } catch (error) {
      console.error("Ошибка:", error);
      showNotification(`Ошибка при добавлении "${product.name}"`, "error"); 
    }
  };

  const removeFromCart = async (id: string) => {
    try {
      const removedItem = cartItems.find((item) => item._id === id);
      await axios.delete(`http://localhost:5000/api/cart/${id}`);
      setCartItems((prev) => prev.filter((item) => item._id !== id));
      if (removedItem) {
        showNotification(`Товар "${removedItem.name}" удалён из корзины`, "info"); 
      }
    } catch (error) {
      console.error("Ошибка удаления из корзины:", error);
      showNotification(`Ошибка при удалении товара`, "error"); 
    }
  };

  return (
    <>
      <div className="notifications-container">
        {notifications.map((notif) => (
          <Notification
            key={notif.id}
            message={notif.message}
            type={notif.type}
            onClose={() => removeNotification(notif.id)}
          />
        ))}
      </div>

      <Header
        onCartClick={() => setIsCartOpen(!isCartOpen)}
        isCartOpen={isCartOpen}
        cartItems={cartItems}
        onRemoveFromCart={removeFromCart}
      />
      <Main />
      <About />
      <Catalog products={products} onAddToCart={addToCart} />
      <MaterialsBlock />
      <InfoBlock />
      <TraditionBlock />
    </>
  );
}

export default App;