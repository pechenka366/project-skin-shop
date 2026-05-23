import About from "./components/About";
import Header from "./components/Header";
import Main from "./components/Main";
import Catalog from "./components/Catalog";
import MaterialsBlock from "./components/MaterialsBlock";
import TraditionBlock from "./components/TraditionBlock";
import InfoBlock from "./components/InfoBlock";
import Notification from "./components/Notification";
import Footer from "./components/Footer";
import AuthSuccess from "./components/AuthSuccess";
import ProductInfo from "./components/ProductInfo";
import Profile from "./components/Profile";
import AdminLayout from "./components/Admin/AdminLayout";
import AdminProducts from "./components/Admin/AdminProducts";
import AdminUsers from "./components/Admin/AdminUsers";
import AdminGuard from "./components/Admin/AdminGuard";
import CategoriesPage from "./components/CategoriesPage";
import CatalogByCategory from "./components/CatalogByCategory";
import Breadcrumbs from "./components/Breadcrumbs";
import AdminCategories from "./components/Admin/AdminCategories";
import "./style/resert.css";
import "./App.css";
import { useEffect, useState } from "react";
import axios from "axios";
import type { Product, CartItem, NotificationState, User } from "./types";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [notifications, setNotifications] = useState<NotificationState[]>([]);
  const API =
    window.location.hostname === "localhost" ? "http://localhost:5000" : "";
  const [user, setUser] = useState<User | null>(null);

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
    setIsLoading(true);
    axios
      .get(`${API}/api/products`)
      .then((response) => {
        const data = response.data;
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          console.error("API вернул не массив:", data);
          setProducts([]);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Ошибка загрузки товаров:", error);
        setProducts([]);
        setIsLoading(false);
      });
  }, [API]);

  useEffect(() => {
    if (user?._id) {
      axios
        .get(`${API}/api/cart/${user._id}`)
        .then((response) => setCartItems(response.data))
        .catch((error) => console.error("Ошибка загрузки корзины:", error));
    }
  }, [user, API]);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    const handleUserLogin = (event: CustomEvent) => {
      setUser(event.detail);
    };
    window.addEventListener("userLogin", handleUserLogin as EventListener);
    return () => {
      window.removeEventListener("userLogin", handleUserLogin as EventListener);
    };
  }, []);

  const handleLogin = (userData: User) => {
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

    const imageUrl = product.images?.[0] || product.img || "";

    try {
      const response = await axios.post(`${API}/api/cart`, {
        userId: user._id,
        productId: product._id,
        name: product.name,
        title: product.title,
        price: product.price,
        img: imageUrl,
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
    <BrowserRouter>
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
      <Breadcrumbs />
      <Routes>
        <Route path="/profile" element={<Profile />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/catalog/:slug" element={<CatalogByCategory />} />
        <Route
          path="/admin/*"
          element={
            <AdminGuard user={user}>
              <AdminLayout />
            </AdminGuard>
          }
        >
          <Route index element={<AdminProducts />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="categories" element={<AdminCategories />} />
        </Route>

        <Route
          path="/"
          element={
            <>
              <Main />
              <About />
              <Catalog
                products={products}
                onAddToCart={addToCart}
                isLoading={isLoading}
              />
              <MaterialsBlock />
              <InfoBlock />
              <TraditionBlock />
            </>
          }
        />

        <Route path="/auth-success" element={<AuthSuccess />} />

        <Route
          path="/product/:id"
          element={
            <ProductInfo
              products={products}
              onAddToCart={addToCart}
              isLoading={isLoading}
            />
          }
        />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;
