import styles from "./Card.module.scss";
import { ShoppingCart as CardCart} from "lucide-react";

interface CardProps {
  _id: string;
  name: string;
  title: string;
  price: number;
  image: string;
  onAddToCart: () => void;
}

function Card({ name, title, price, image, onAddToCart }: CardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.catalogCard}>
        <img className={styles.placeholder} src={image} alt={name} />
        <button className={styles.cardCart} onClick={onAddToCart}>
          <CardCart className={styles.image} />
        </button>
      </div>
      <div className={styles.cardPrice}>
        <h3 className={styles.cardName}>{name}</h3>
        <p className={styles.cardText}>{title}</p>
        <div className={styles.cardCost}>{price.toLocaleString()} ₽</div>
      </div>
    </div>
  );
}

export default Card;