import styles from "./Catalog.module.scss";
import Card from "../Card";
import type { Product } from "../../types"; 

interface CatalogProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  isLoading: boolean;
}

function Catalog({ products, onAddToCart, isLoading }: CatalogProps) {

  const renderItems = () => {
    const items = isLoading ? [...Array(6)] : products;
    
    return items.map((product, index) => (
      <Card
        key={isLoading ? `skeleton-${index}` : product._id}
        _id={isLoading ? `skeleton-${index}` : product._id}
        name={isLoading ? "" : product.name}
        title={isLoading ? "" : product.title}
        price={isLoading ? 0 : product.price}
        image={isLoading ? "" : product.images?.[0] || ""}
        onAddToCart={() => {
          if (!isLoading) onAddToCart(product);
        }}
        loading={isLoading}
      />
    ));
  };

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
        {renderItems()}
      </div>
    </section>
  );
}

export default Catalog;