import { useEffect, useState } from "react";
import Card from "../Card";
import styles from "./Catalog.module.scss";
import axios from "axios";

interface Product {
  _id: string;
  name: string;
  title: string;
  price: number;
  img: string;
}

function Catalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/products")
      .then((response) => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Ошибка загрузки: ", err);
        setError("Не удалось загрузить товары");
        setLoading(false)
      });
  }, []);

  if(loading) {
    return <div className={styles.loading}>Загрузка...</div>
  }

  if (error){
    return <div className={styles.error}>{error}</div>
  }

  return (
    <section className={styles.catalog}>
      <div className={styles.catalogContainer}>
        <h3 className={styles.catalogTitle}>Наша коллекция</h3>
        <h1 className={styles.catalogName}>Изделия ручной работы</h1>
        <p className={styles.catalogText}>
          Каждое изделие создается вручную из тщательно отобранной натуральной
          кожи высочайшего качества
        </p>
      </div>
      <div className={styles.catalogGallery}>
        {products.map((product) => (
          <Card 
          key={product._id}
          name={product.name}
          title={product.title}
          price={product.price}
          image={product.img}/>
        ))}
      </div>
    </section>
  );
}

export default Catalog;
