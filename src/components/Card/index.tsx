import styles from "./Card.module.scss";
import { Heart as CardHeart } from "lucide-react";
import ContentLoader from "react-content-loader";
import { Link } from "react-router-dom";

interface CardProps {
  _id: string;
  name: string;
  title: string;
  price: number;
  image: string;
  onAddToCart: () => void;
  loading: boolean;
}

function Card({
  _id,
  name,
  title,
  price,
  image,
  onAddToCart,
  loading = false,
}: CardProps) {
  const handleClick = () => {
    onAddToCart();
  };

  return (
    <div className={styles.card}>
      {loading ? (
        <ContentLoader
          speed={1}
          width={462}
          height={774}
          viewBox="0 0 462 774"
          backgroundColor="#e0e0e0"
          foregroundColor="#f5f5f5"
        >
          <rect x="0" y="0" rx="10" ry="10" width="460" height="610" />
          <rect x="0" y="674" rx="10" ry="10" width="193" height="38" />
          <rect x="0" y="624" rx="10" ry="10" width="191" height="38" />
          <rect x="0" y="724" rx="10" ry="10" width="137" height="38" />
          <rect x="259" y="660" rx="0" ry="0" width="1" height="0" />
          <rect x="258" y="700" rx="10" ry="10" width="193" height="56" />
        </ContentLoader>
      ) : (
        <>
          <div className={styles.catalogCard}>
            <div className={styles.catalogRouter}>
              <nav>
                <Link to={`/product/${_id}`}>
                  <img className={styles.placeholder} src={image} alt={name} />
                </Link>
              </nav>
            </div>
            <button className={styles.cardCart}>
              <CardHeart className={styles.image} />
            </button>
          </div>
          <div className={styles.cardInfo}>
            <div className={styles.cardPrice}>
              <h3 className={styles.cardName}>{name}</h3>
              <p className={styles.cardText}>{title}</p>
              <div className={styles.cardCost}>{price.toLocaleString()} ₽</div>
            </div>
            <div className={styles.cardButton}>
              <button className={styles.cardInCart} onClick={handleClick}>
                <p className={styles.cardInInfo}>Добавить</p>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Card;