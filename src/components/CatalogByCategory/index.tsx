import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Card from "../Card";
import styles from "./CatalogByCategory.module.scss";

interface Product {
  _id: string;
  name: string;
  title: string;
  price: number;
  images: string[];
  category?: string;
}

function CatalogByCategory() {
  const { slug } = useParams<{ slug: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = window.location.hostname === "localhost" 
    ? "http://localhost:5000" 
    : "https://bahtarma.ru";

  useEffect(() => {
    if (!slug) return;
    
    setLoading(true);
    axios
      .get(`${API_URL}/api/products/category/${slug}`)
      .then((response) => {
        setProducts(response.data);
        if (response.data.length > 0 && response.data[0].category) {
          setCategoryName(response.data[0].category);
        } else {
          axios.get(`${API_URL}/api/categories`).then((res) => {
            const cat = res.data.find((c: any) => c.slug === slug);
            if (cat) setCategoryName(cat.name);
          });
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Ошибка загрузки товаров:", err);
        setError("Не удалось загрузить товары");
        setLoading(false);
      });
  }, [slug, API_URL]);

  if (loading) {
    return <div className={styles.loading}>Загрузка...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.catalogPage}>
      <div className={styles.container}>
        <div className={styles.header}>
          <Link to="/categories" className={styles.backLink}>
            ← Все категории
          </Link>
          <h1 className={styles.title}>{categoryName || slug}</h1>
          <p className={styles.count}>Найдено {products.length} товаров</p>
        </div>
        
        {products.length === 0 ? (
          <div className={styles.empty}>
            <p>В этой категории пока нет товаров</p>
            <Link to="/categories" className={styles.emptyLink}>
              Перейти к категориям
            </Link>
          </div>
        ) : (
          <div className={styles.productsGrid}>
            {products.map((product) => (
              <Card
                key={product._id}
                _id={product._id}
                name={product.name}
                title={product.title}
                price={product.price}
                image={product.images?.[0] || ""}
                onAddToCart={() => {}}
                loading={false}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CatalogByCategory;