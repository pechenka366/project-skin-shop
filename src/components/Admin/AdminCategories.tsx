import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./Admin.module.scss";

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
}

function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const API_URL = window.location.hostname === "localhost" ? "http://localhost:5000" : "https://bahtarma.ru";
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/admin/categories`, {
        params: { userId: user._id }
      });
      setCategories(response.data);
    } catch (error) {
      console.error("Ошибка загрузки категорий:", error);
      setMessage({ text: "Ошибка загрузки категорий", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (): Promise<string> => {
    if (!selectedFile) return "";
    
    const formData = new FormData();
    formData.append("image", selectedFile);
    
    const response = await axios.post(`${API_URL}/api/upload`, formData, {
      params: { userId: user._id },
      headers: { "Content-Type": "multipart/form-data" }
    });
    
    return response.data.url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    
    let imageUrl = formData.image;
    if (selectedFile) {
      imageUrl = await uploadImage();
    }
    
    const categoryData = {
      name: formData.name,
      description: formData.description,
      image: imageUrl,
      userId: user._id,
    };
    
    try {
      if (editingCategory) {
        await axios.put(`${API_URL}/api/admin/categories/${editingCategory._id}`, categoryData);
        setMessage({ text: "Категория обновлена!", type: "success" });
      } else {
        await axios.post(`${API_URL}/api/admin/categories`, categoryData);
        setMessage({ text: "Категория создана!", type: "success" });
      }
      
      setFormData({ name: "", description: "", image: "" });
      setSelectedFile(null);
      setEditingCategory(null);
      loadCategories();
    } catch (err: any) {
      setMessage({ text: err.response?.data?.message || "Ошибка сохранения", type: "error" });
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || "",
      image: category.image || "",
    });
  };

  const handleDelete = async (id: string) => {
    if (confirm("Удалить категорию? Товары в этой категории останутся без категории.")) {
      try {
        await axios.delete(`${API_URL}/api/admin/categories/${id}`, {
          params: { userId: user._id }
        });
        setMessage({ text: "Категория удалена!", type: "success" });
        loadCategories();
      } catch (error) {
        console.error("Ошибка удаления:", error);
        setMessage({ text: "Ошибка удаления", type: "error" });
      }
    }
  };

  if (loading) return <div>Загрузка...</div>;

  return (
    <div className={styles.adminCategories}>
      <h1>Управление категориями</h1>
      
      {message && (
        <div className={`${styles.message} ${styles[message.type]}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.categoryForm}>
        <h2>{editingCategory ? "Редактировать категорию" : "Новая категория"}</h2>
        
        <input
          type="text"
          placeholder="Название категории"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        
        <textarea
          placeholder="Описание (необязательно)"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
        />
        
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
        />
        
        {formData.image && !selectedFile && (
          <div className={styles.imagePreview}>
            <img src={formData.image} alt="preview" width={80} />
          </div>
        )}
        
        <div className={styles.formButtons}>
          <button type="submit">{editingCategory ? "Обновить" : "Создать"}</button>
          {editingCategory && (
            <button type="button" onClick={() => {
              setEditingCategory(null);
              setFormData({ name: "", description: "", image: "" });
              setSelectedFile(null);
            }}>Отмена</button>
          )}
        </div>
      </form>

      <div className={styles.categoriesList}>
        <h2>Список категорий</h2>
        {categories.length === 0 ? (
          <p>Нет категорий. Создайте первую!</p>
        ) : (
          <div className={styles.categoriesGrid}>
            {categories.map((category) => (
              <div key={category._id} className={styles.categoryCard}>
                {category.image ? (
                  <img src={category.image} alt={category.name} className={styles.categoryImage} />
                ) : (
                  <div className={styles.categoryPlaceholder}>📁</div>
                )}
                <div className={styles.categoryInfo}>
                  <h3>{category.name}</h3>
                  <p className={styles.categorySlug}>slug: {category.slug}</p>
                  {category.description && <p className={styles.categoryDesc}>{category.description}</p>}
                </div>
                <div className={styles.categoryActions}>
                  <button onClick={() => handleEdit(category)} className={styles.editBtn}>✏️</button>
                  <button onClick={() => handleDelete(category._id)} className={styles.deleteBtn}>🗑️</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminCategories;