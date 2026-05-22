import styles from "./ProductInfo.module.scss";
import Card from "../Card";
import { ArrowLeft as ProductArrow } from "lucide-react";
import { ShoppingCart as ProductCart } from "lucide-react";
import { Truck as ProductTruck } from "lucide-react";
import { Shield as ProductProtect } from "lucide-react";
import { Box as ProductBox } from "lucide-react";
import { Check as ProductCheck } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import type { Product } from "../../types";

interface CatalogProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  isLoading: boolean;
}

function ProductInfo({ products, onAddToCart, isLoading }: CatalogProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mainImage, setMainImage] = useState<string>("");

  const API_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:5000' 
    : 'https://bahtarma.ru';

  useEffect(() => {
    if (!id) {
      navigate("/");
      return;
    }

    setLoading(true);
    axios
      .get(`${API_URL}/api/products/${id}`)
      .then((response) => {
        const productData = response.data;
        setProduct(productData);
        const firstImage = productData.images?.[0] || productData.img || "";
        setMainImage(firstImage);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Ошибка загрузки товара:", err);
        setError("Товар не найден");
        setLoading(false);
      });
  }, [id, API_URL, navigate]);

  const handleImageClick = (imageUrl: string) => {
    setMainImage(imageUrl);
  };

  if (loading) {
    return <div className={styles.loading}>Загрузка...</div>;
  }

  if (error || !product) {
    return <div className={styles.error}>{error || "Товар не найден"}</div>;
  }

  const images = product.images?.length ? product.images : (product.img ? [product.img] : []);

  const renderItems = () => {
    const items = isLoading ? [...Array(6)] : products;

    return items.map((product, index) => (
      <Card
        key={isLoading ? `skeleton-${index}` : product._id}
        _id={isLoading ? `skeleton-${index}` : product._id}
        name={isLoading ? "" : product.name}
        title={isLoading ? "" : product.title}
        price={isLoading ? 0 : product.price}
        image={isLoading ? "" : product.images?.[0] || product.img || ""}
        onAddToCart={() => {
          if (!isLoading) onAddToCart(product);
        }}
        loading={isLoading}
      />
    ));
  };

  return (
    <section className={styles.product}>
      <div className={styles.productAbout}>
        <div className={styles.productBack}>
          <nav>
            <Link to="/">
              <button className={styles.productButtonBack}>
                <ProductArrow className={styles.productImageArrow} />
                <p className={styles.productBackText}>Вернуться к каталогу</p>
              </button>
            </Link>
          </nav>
        </div>
        <div className={styles.productOur}>
          <div className={styles.productLeft}>
            <div className={styles.productLeftImage}>
              <img
                className={styles.productBigImage}
                src={mainImage}
                alt={product.name}
              />
            </div>
            {images.length > 1 && (
              <div className={styles.productLeftSmall}>
                {images.map((img, idx) => (
                  <img
                    key={idx}
                    className={styles.productSmallImage}
                    src={img}
                    alt={`${product.name} - ${idx + 1}`}
                    onClick={() => handleImageClick(img)}
                  />
                ))}
              </div>
            )}
          </div>
          <div className={styles.productRight}>
            <h1 className={styles.productBackpack}>{product.name}</h1>
            <p className={styles.productPackInfo}>{product.title}</p>
            <p className={styles.productPrice}>₽ {product.price.toLocaleString()}</p>
            <p className={styles.productInfo}>
              {product.description || "Функциональный кожаный рюкзак для работы и путешествий. Сочетает классический стиль с современной практичностью, предлагая достаточно места для ноутбука и личных вещей."}
            </p>
            <button 
              className={styles.productButton}
              onClick={() => onAddToCart(product)}
            >
              <ProductCart />
              <p className={styles.productButtonText}>Добавить в корзину</p>
            </button>
            <div className={styles.productFlex}>
              <div className={styles.productFlexClass}>
                <ProductTruck className={styles.productFlexImage} />
                <p className={styles.productFlexText}>Доставка 2-5 дней</p>
              </div>
              <div className={styles.productFlexClass}>
                <ProductProtect className={styles.productFlexImage} />
                <p className={styles.productFlexText}>Гарантия 2 года</p>
              </div>
              <div className={styles.productFlexClass}>
                <ProductBox className={styles.productFlexImage} />
                <p className={styles.productFlexText}>Подарочная упаковка</p>
              </div>
            </div>

            {/* Особенности из БД */}
            {product.features && product.features.length > 0 && (
              <div className={styles.productPeculiarities}>
                <h1 className={styles.productPeculiaritiesInfo}>Особенности</h1>
                {product.features.map((feature, idx) => (
                  <div key={idx} className={styles.productPeculiaritiesLi}>
                    <ProductCheck className={styles.productPeculiaritiesImage} />
                    <p className={styles.productPeculiaritiesText}>{feature}</p>
                  </div>
                ))}
              </div>
            )}
            {product.materials && product.materials.length > 0 && (
              <div className={styles.productMaterials}>
                <div className={styles.productMaterialName}>
                  <h1 className={styles.productMaterialInfo}>Материалы</h1>
                </div>
                <div className={styles.productMaterialis}>
                  {product.materials.map((material, idx) => (
                    <p key={idx} className={styles.productMaterial}>{material}</p>
                  ))}
                </div>
              </div>
            )}
            {product.size && (
              <div className={styles.productSize}>
                <h1 className={styles.productSizeName}>Размер</h1>
                <p className={styles.productSizeText}>{product.size}</p>
              </div>
            )}
          </div>
        </div>
        <div className={styles.productBottom}>
          <div className={styles.productBottomName}>
            <h1 className={styles.productBottomNames}>Похожие товары</h1>
          </div>
          <div className={styles.productGallery}>{renderItems()}</div>
        </div>
      </div>
    </section>
  );
}

export default ProductInfo;