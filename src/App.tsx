import About from "./components/About";
import Header from "./components/Header";
import Main from "./components/Main";
import Catalog from "./components/Catalog";
import MaterialsBlock from "./components/materialsBlock";
import TraditionBlock from "./components/TraditionBlock";
import InfoBlock from "./components/InfoBlock";
import Notification from "./components/Notification";
import Footer from "./components/Footer";
import "./style/resert.css";
import "./App.css";
import { useEffect, useState } from "react";
import axios from "axios";
import type { Product, CartItem, NotificationState } from "./types";

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [notifications, setNotifications] = useState<NotificationState[]>([]);
  const API = import.meta.env.VITE_API_URL;
  const [user, setUser] = useState<{
    _id: string;
    name: string;
    email: string;
  } | null>(null);

  const showNotification = (
    message: string,
    type: "success" | "error" | "info",
  ) => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { message, type, id }]);
  };

  const removeNotification = (id: number) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/products`)
      .then((response) => setProducts(response.data))
      .catch((error) => console.error("Ошибка загрузки товаров:", error));
  }, []);

  useEffect(() => {
    if (user?._id) {
      axios
        .get(`${API}/api/cart/${user._id}`)
        .then((response) => setCartItems(response.data))
        .catch((error) => console.error("Ошибка загрузки корзины:", error));
    }
  }, [user]);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (userData: {
    _id: string;
    name: string;
    email: string;
  }) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    setCartItems([]);
    localStorage.removeItem("user");
  };

  const addToCart = async (product: Product) => {
    console.log("user:", user);
    console.log("user._id:", user?._id);
    if (!user) {
      showNotification(
        "Войдите в аккаунт, чтобы добавить товар в корзину",
        "info",
      );
      return;
    }

    try {
      const response = await axios.post(`${API}/api/cart`, {
        userId: user._id,
        productId: product._id,
        name: product.name,
        title: product.title,
        price: product.price,
        img: product.img,
        quantity: 1,
      });

      setCartItems((prev) => {
        const existing = prev.find((item) => item.productId === product._id);
        if (existing) {
          return prev.map((item) =>
            item.productId === product._id
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          );
        }
        return [...prev, response.data];
      });

      showNotification(`Товар "${product.name}" добавлен в корзину`, "success");
    } catch (error) {
      console.error("Ошибка:", error);
      showNotification(`Ошибка при добавлении "${product.name}"`, "error");
    }
  };

  const removeFromCart = async (productId: string) => {
    if (!user) return;

    try {
      const removedItem = cartItems.find(
        (item) => item.productId === productId,
      );
      await axios.delete(`${API}/api/cart/${user._id}/${productId}`);
      setCartItems((prev) =>
        prev.filter((item) => item.productId !== productId),
      );
      if (removedItem) {
        showNotification(
          `Товар "${removedItem.name}" удалён из корзины`,
          "info",
        );
      }
    } catch (error) {
      console.error("Ошибка удаления:", error);
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
        user={user}
        onLogout={handleLogout}
        onLogin={handleLogin}
      />
      <Main />
      <About />
      <Catalog products={products} onAddToCart={addToCart} />
      <MaterialsBlock />
      <InfoBlock />
      <TraditionBlock />
      <Footer />
    </>
  );
}

export default App;
