import styles from "./Catalog.module.scss";
import Card from "../Card";

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
}

function Catalog({ products, onAddToCart }: CatalogProps) {
  if (products.length === 0) {
    return <div className={styles.loading}>Загрузка...</div>;
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
            _id={product._id}
            name={product.name}
            title={product.title}
            price={product.price}
            image={product.img}
            onAddToCart={() => {
              onAddToCart(product);
            }}
          />
        ))}
      </div>
    </section>
  );
}

export default Catalog;
