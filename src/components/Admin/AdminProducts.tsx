import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './Admin.module.scss';

interface Product {
  _id: string;
  name: string;
  title: string;
  price: number;
  images: string[];
  description?: string;
  category?: string;
  stock?: number;
  features?: string[];
  materials?: string[];
  size?: string;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
}

function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    price: '',
    description: '',
    category: '',
    stock: '',
    features: ['', '', '', ''],
    materials: ['', '', ''],
    size: '',
  });
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

  const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:5000' : 'https://bahtarma.ru';
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/admin/products`, {
        params: { userId: user._id }
      });
      setProducts(response.data);
    } catch (error) {
      console.error('Ошибка загрузки товаров:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    setLoadingCategories(true);
    try {
      const response = await axios.get(`${API_URL}/api/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error('Ошибка загрузки категорий:', error);
    } finally {
      setLoadingCategories(false);
    }
  };

  const uploadImages = async (): Promise<string[]> => {
    if (!selectedFiles || selectedFiles.length === 0) return [];
    
    const formData = new FormData();
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append('images', selectedFiles[i]);
    }
    
    const response = await axios.post(`${API_URL}/api/upload/products`, formData, {
      params: { userId: user._id },
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    
    return response.data.urls;
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const handleMaterialChange = (index: number, value: string) => {
    const newMaterials = [...formData.materials];
    newMaterials[index] = value;
    setFormData({ ...formData, materials: newMaterials });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let imageUrls = editingProduct?.images || [];
    if (selectedFiles && selectedFiles.length > 0) {
      imageUrls = await uploadImages();
    }
    
    const features = formData.features.filter(f => f.trim() !== '');
    const materials = formData.materials.filter(m => m.trim() !== '');
    
    const productData = {
      name: formData.name,
      title: formData.title,
      price: Number(formData.price),
      images: imageUrls,
      description: formData.description,
      category: formData.category,
      stock: Number(formData.stock) || 0,
      features: features,
      materials: materials,
      size: formData.size,
      userId: user._id,
    };
    
    try {
      if (editingProduct) {
        await axios.put(`${API_URL}/api/admin/products/${editingProduct._id}`, productData);
      } else {
        await axios.post(`${API_URL}/api/admin/products`, productData);
      }
      
      setFormData({ 
        name: '', title: '', price: '', description: '', category: '', stock: '',
        features: ['', '', '', ''], materials: ['', '', ''], size: ''
      });
      setSelectedFiles(null);
      setEditingProduct(null);
      loadProducts();
    } catch (error) {
      console.error('Ошибка сохранения:', error);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      title: product.title,
      price: product.price.toString(),
      description: product.description || '',
      category: product.category || '',
      stock: product.stock?.toString() || '',
      features: product.features?.length ? [...product.features, ...Array(4 - product.features.length).fill('')] : ['', '', '', ''],
      materials: product.materials?.length ? [...product.materials, ...Array(3 - product.materials.length).fill('')] : ['', '', ''],
      size: product.size || '',
    });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Удалить товар?')) {
      try {
        await axios.delete(`${API_URL}/api/admin/products/${id}`, {
          params: { userId: user._id }
        });
        loadProducts();
      } catch (error) {
        console.error('Ошибка удаления:', error);
      }
    }
  };

  if (loading) return <div>Загрузка...</div>;

  return (
    <div className={styles.adminProducts}>
      <h1>Управление товарами</h1>

      <form onSubmit={handleSubmit} className={styles.productForm}>
        <h2>{editingProduct ? 'Редактировать товар' : 'Новый товар'}</h2>
        
        <input
          type="text"
          placeholder="Название"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        
        <input
          type="text"
          placeholder="Краткое описание"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
        
        <input
          type="number"
          placeholder="Цена"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          required
        />
        
        <textarea
          placeholder="Полное описание"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
        />
        
        <div className={styles.formGroup}>
          <label>Категория</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className={styles.categorySelect}
            required
          >
            <option value="">Выберите категорию</option>
            {loadingCategories ? (
              <option disabled>Загрузка категорий...</option>
            ) : categories.length === 0 ? (
              <option disabled>Нет категорий. Сначала создайте категорию</option>
            ) : (
              categories.map((category) => (
                <option key={category._id} value={category.name}>
                  {category.name}
                </option>
              ))
            )}
          </select>
          {categories.length === 0 && !loadingCategories && (
            <p className={styles.hint}>
              Нет доступных категорий. Создайте их в разделе "Управление категориями"
            </p>
          )}
        </div>
        
        <input
          type="number"
          placeholder="Количество на складе"
          value={formData.stock}
          onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
        />
        
        <h3>Особенности (4 шт)</h3>
        {formData.features.map((feature, idx) => (
          <input
            key={idx}
            type="text"
            placeholder={`Особенность ${idx + 1}`}
            value={feature}
            onChange={(e) => handleFeatureChange(idx, e.target.value)}
          />
        ))}
        
        <h3>Материалы (3 шт)</h3>
        {formData.materials.map((material, idx) => (
          <input
            key={idx}
            type="text"
            placeholder={`Материал ${idx + 1}`}
            value={material}
            onChange={(e) => handleMaterialChange(idx, e.target.value)}
          />
        ))}
        
        <input
          type="text"
          placeholder="Размер (например: 35 x 28 x 12 см)"
          value={formData.size}
          onChange={(e) => setFormData({ ...formData, size: e.target.value })}
        />
        
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => setSelectedFiles(e.target.files)}
        />
        
        {editingProduct?.images?.length ? (
          <div className={styles.imagePreview}>
            {editingProduct.images.map((img, idx) => (
              <img key={idx} src={img} alt="preview" width={50} />
            ))}
          </div>
        ) : null}
        
        <div className={styles.formButtons}>
          <button type="submit">{editingProduct ? 'Обновить' : 'Добавить'}</button>
          {editingProduct && (
            <button type="button" onClick={() => {
              setEditingProduct(null);
              setFormData({ 
                name: '', title: '', price: '', description: '', category: '', stock: '',
                features: ['', '', '', ''], materials: ['', '', ''], size: ''
              });
            }}>Отмена</button>
          )}
        </div>
      </form>

      <div className={styles.productsList}>
        <h2>Существующие товары</h2>
        {products.map(product => (
          <div key={product._id} className={styles.productCard}>
            {product.images?.[0] && (
              <img src={product.images[0]} alt={product.name} />
            )}
            <h3>{product.name || 'Без названия'}</h3>
            <p className={styles.productPrice}>{product.price?.toLocaleString() || 0} ₽</p>
            {product.category && (
              <p className={styles.productCategory}>Категория: {product.category}</p>
            )}
            <div className={styles.productActions}>
              <button onClick={() => handleEdit(product)} className={styles.editBtn}>✏️ Редактировать</button>
              <button onClick={() => handleDelete(product._id)} className={styles.deleteBtn}>🗑️ Удалить</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminProducts;