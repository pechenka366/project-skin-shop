import { useEffect, useRef } from "react";
import styles from "./Cart.module.scss";

interface CartItem {
  _id: string;
  name: string;
  title: string;
  price: number;
  img: string;
  quantity: number;
}

interface CartProps {
  items: CartItem[];
  onRemove: (id: string) => void;
  onClose: () => void;
  isOpen: boolean;
}

function Cart({ items, onRemove, onClose, isOpen }: CartProps) {
  const cartRef = useRef<HTMLDivElement>(null);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const isCartIcon = target.closest('[data-cart-icon]');
      
      if (cartRef.current && !cartRef.current.contains(target) && !isCartIcon) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.cartDropdown} ref={cartRef}>
      <div className={styles.header}>
        <h3>Корзина</h3>
        <button className={styles.closeBtn} onClick={onClose}>×</button>
      </div>

      {items.length === 0 ? (
        <div className={styles.empty}>Корзина пуста</div>
      ) : (
        <>
          <div className={styles.items}>
            {items.map((item) => (
              <div key={item._id} className={styles.cartItem}>
                <img src={item.img} alt={item.name} className={styles.image} />
                <div className={styles.info}>
                  <h4>{item.name}</h4>
                  <p>{item.title}</p>
                  <div className={styles.price}>
                    {item.price.toLocaleString()} ₽ × {item.quantity}
                  </div>
                </div>
                <button 
                  className={styles.removeBtn}
                  onClick={() => onRemove(item._id)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <div className={styles.footer}>
            <div className={styles.total}>
              <span>Итого:</span>
              <strong>{totalPrice.toLocaleString()} ₽</strong>
            </div>
            <button className={styles.checkoutBtn}>
              Перейти к оплате
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;