import styles from "./Card.module.scss";

interface CardProps {
  name: string;
  title: string;
  price: number;
  image: string;
}

function Card({name, title, price, image}: CardProps) {
  return (
    <section className={styles.card}>
      <div className={`${styles.catalogCard}`}>
        <img className={styles.placeholder} src={image} alt="img-main" />
        <img className={styles.cardCart} src="./img/cart.svg" alt="cart-card" />
      </div>
      <div className={styles.cardPrice}>
        <h1 className={styles.cardName}>{name}</h1>
        <p className={styles.cardText}>{title}</p>
        <h2 className={styles.cardCost}>₽ {price.toLocaleString()}</h2>
      </div>
    </section>
  );
}

export default Card;
