import styles from "./ProductInfo.module.scss";
import { ArrowLeft as ProductArrow } from "lucide-react";
import { ShoppingCart as ProductCart } from "lucide-react";
import { Truck as ProductTruck } from "lucide-react";
import { Shield as ProductProtect } from "lucide-react";
import { Box as ProductBox } from "lucide-react";
import { Link } from "react-router-dom";

function ProductInfo() {
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
                  src="/img/mainImg.jpg"
                  alt="big-image"
                />
              </div>
              <div className={styles.productLeftSmall}>
                <img
                  className={styles.productSmallImage}
                  src="/img/mainImg.jpg"
                  alt="big-image"
                />
                <img
                  className={styles.productSmallImage}
                  src="/img/mainImg.jpg"
                  alt="big-image"
                />
                <img
                  className={styles.productSmallImage}
                  src="/img/mainImg.jpg"
                  alt="big-image"
                />
              </div>
            </div>
            <div className={styles.productRight}>
              <h1 className={styles.productBackpack}>Кожаный рюкзак</h1>
              <p className={styles.productPackInfo}>
                Вместительный, удобный крой
              </p>
              <p className={styles.productPrice}>₽ 21 900</p>
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
                  <ProductTruck  className={styles.productFlexImage} />
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
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default ProductInfo;
