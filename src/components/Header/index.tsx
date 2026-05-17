import styles from "./Header.module.scss";
import Cart from "../Cart/index";

interface HeaderProps {
  onCartClick: () => void;
  isCartOpen: boolean;
  cartItems: any[];
  onRemoveFromCart: (id: string) => void;
}

function Header({ onCartClick, isCartOpen, cartItems, onRemoveFromCart }: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        <span className={styles.logo}>KOVAC</span>
        <nav>
          <ul className={styles.navList}>
            <li className={styles.navItem}>
              <a href="/" className={styles.navLink}>Каталог</a>
            </li>
            <li className={styles.navItem}>
              <a href="#" className={styles.navLink}>О нас</a>
            </li>
            <li className={styles.navItem}>
              <a href="#" className={styles.navLink}>Мастерская</a>
            </li>
            <li className={styles.navItem}>
              <a href="#" className={styles.navLink}>Контакты</a>
            </li>
          </ul>
        </nav>
        <div className={styles.icons}>
          <img src="/img/magnifier.svg" alt="magnifier" width={28} height={28} />
          <div className={styles.cartWrapper}>
            <img 
              src="/img/bag.svg" 
              alt="bag" 
              width={28} 
              height={28} 
              onClick={onCartClick}
              className={styles.cartIcon}
              data-cart-icon="true" 
            />
            {isCartOpen && (
              <div className={styles.cartDropdownContainer}>
                <Cart 
                  items={cartItems}
                  onRemove={onRemoveFromCart}
                  onClose={onCartClick}
                  isOpen={isCartOpen}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;