import About from "./components/About";
import Header from "./components/Header";
import Main from "./components/Main";
import Catalog from "./components/Catalog";
import MaterialsBlock from "./components/materialsBlock";
import TraditionBlock from "./components/TraditionBlock";
import InfoBlock from "./components/InfoBlock";
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

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

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
          return prev.map((item) =>
            item._id === product._id
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          );
        }
        return [...prev, response.data];
      });
    } catch (error) {
      console.error("Ошибка добавления в корзину:", error);
    }
  };

  const removeFromCart = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/cart/${id}`);
      setCartItems((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Ошибка удаления из корзины:", error);
    }
  };

  return (
    <>
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
