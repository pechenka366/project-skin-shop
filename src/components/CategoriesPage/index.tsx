import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import styles from "./CategoriesPage.module.scss";

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
}

function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = window.location.hostname === "localhost" 
    ? "http://localhost:5000" 
    : "https://bahtarma.ru";

  useEffect(() => {
    axios
      .get(`${API_URL}/api/categories`)
      .then((response) => {
        setCategories(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Ошибка загрузки категорий:", err);
        setError("Не удалось загрузить категории");
        setLoading(false);
      });
  }, [API_URL]);

  if (loading) {
    return <div className={styles.loading}>Загрузка...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.categoriesPage}>
      <div className={styles.container}>
        <h1 className={styles.title}>Категории товаров</h1>
        <p className={styles.subtitle}>Выберите интересующую вас категорию</p>
        
        <div className={styles.categoriesGrid}>
          {categories.map((category) => (
            <Link
              key={category._id}
              to={`/catalog/${category.slug}`}
              className={styles.categoryCard}
            >
              {category.image ? (
                <img src={category.image} alt={category.name} className={styles.categoryImage} />
              ) : (
                <div className={styles.categoryPlaceholder}>
                  <span>📁</span>
                </div>
              )}
              <h3 className={styles.categoryName}>{category.name}</h3>
              {category.description && (
                <p className={styles.categoryDescription}>{category.description}</p>
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CategoriesPage;