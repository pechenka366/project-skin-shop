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

interface Product {
  _id: string;
  name: string;
  title: string;
  price: number;
  img: string;
}

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

  const API_URL = "http://localhost:5000"

  useEffect(() => {
    if (!id) {
      navigate("/");
      return;
    }

    setLoading(true);
    axios
      .get(`${API_URL}/api/products/${id}`)
      .then((response) => {
        setProduct(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Ошибка загрузки товара:", err);
        setError("Товар не найден");
        setLoading(false);
      });
  }, [id, API_URL, navigate]);

  if (loading) {
    return <div className={styles.loading}>Загрузка...</div>;
  }

  if (error || !product) {
    return <div className={styles.error}>{error || "Товар не найден"}</div>;
  }

  const renderItems = () => {
    const items = isLoading ? [...Array(6)] : products;

    return items.map((product, index) => (
      <Card
        key={isLoading ? `skeleton-${index}` : product._id}
        _id={isLoading ? `skeleton-${index}` : product._id}
        name={isLoading ? "" : product.name}
        title={isLoading ? "" : product.title}
        price={isLoading ? 0 : product.price}
        image={isLoading ? "" : product.img}
        onAddToCart={() => {
          if (!isLoading) onAddToCart(product);
        }}
        loading={isLoading}
      />
    ));
  };

  return (
    <>
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
                  src={product.img}
                  alt={product.name}
                />
              </div>
              <div className={styles.productLeftSmall}>
                <img
                  className={styles.productSmallImage}
                  src={product.img}
                  alt={product.name}
                />
                <img
                  className={styles.productSmallImage}
                  src={product.img}
                  alt={product.name}
                />
                <img
                  className={styles.productSmallImage}
                  src={product.img}
                  alt={product.name}
                />
              </div>
            </div>
            <div className={styles.productRight}>
              <h1 className={styles.productBackpack}>{product.name}</h1>
              <p className={styles.productPackInfo}>
                {product.title}
              </p>
              <p className={styles.productPrice}>₽ {product.price.toLocaleString()}</p>
              <p className={styles.productInfo}>
                Функциональный кожаный рюкзак для работы и путешествий. Сочетает
                классический стиль с современной практичностью, предлагая
                достаточно места для ноутбука и личных вещей.
              </p>
              <button className={styles.productButton}>
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
              <div className={styles.productPeculiarities}>
                <h1 className={styles.productPeculiaritiesInfo}>Особенности</h1>
                <div className={styles.productPeculiaritiesLi}>
                  <ProductCheck className={styles.productPeculiaritiesImage} />
                  <p className={styles.productPeculiaritiesText}>
                    Натуральная итальянская кожа высшего сорта
                  </p>
                </div>
                <div className={styles.productPeculiaritiesLi}>
                  <ProductCheck className={styles.productPeculiaritiesImage} />
                  <p className={styles.productPeculiaritiesText}>
                    Натуральная итальянская кожа высшего сорта
                  </p>
                </div>
                <div className={styles.productPeculiaritiesLi}>
                  <ProductCheck className={styles.productPeculiaritiesImage} />
                  <p className={styles.productPeculiaritiesText}>
                    Натуральная итальянская кожа высшего сорта
                  </p>
                </div>
                <div className={styles.productPeculiaritiesLi}>
                  <ProductCheck className={styles.productPeculiaritiesImage} />
                  <p className={styles.productPeculiaritiesText}>
                    Натуральная итальянская кожа высшего сорта
                  </p>
                </div>
              </div>
              <div className={styles.productMaterials}>
                <div className={styles.productMaterialName}>
                  <h1 className={styles.productMaterialInfo}>Материалы</h1>
                </div>
                <div className={styles.productMaterialis}>
                  <p className={styles.productMaterial}>Натуральная кожа</p>
                  <p className={styles.productMaterial}>Натуральная кожа</p>
                  <p className={styles.productMaterial}>Натуральная кожа</p>
                </div>
              </div>
              <div className={styles.productSize}>
                <h1 className={styles.productSizeName}>Размер</h1>
                <p className={styles.productSizeText}>35 x 28 x 12 см</p>
              </div>
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
    </>
  );
}

export default ProductInfo;
