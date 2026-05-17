import styles from "./Header.module.scss";
import Cart from "../Cart/index";
import { useState } from "react";
import AuthModal from "../AuthModal/index";

interface HeaderProps {
  onCartClick: () => void;
  isCartOpen: boolean;
  cartItems: any[];
  onRemoveFromCart: (id: string) => void;
  user: { _id: string; name: string; email: string } | null;
  onLogout: () => void;
  onLogin: (userData: { _id: string; name: string; email: string }) => void;
}

function Header({
  onCartClick,
  isCartOpen,
  cartItems,
  onRemoveFromCart,
  user,
  onLogout,
  onLogin,
}: HeaderProps) {
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  return (
    <>
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLogin={(userData) => {
          onLogin(userData);
          setIsAuthOpen(false);
        }}
      />

      <header className={styles.header}>
        <div className={styles.headerContainer}>
          <span className={styles.logo}>KOVAC</span>
          <nav>
            <ul className={styles.navList}>
              <li className={styles.navItem}>
                <a href="/" className={styles.navLink}>
                  Каталог
                </a>
              </li>
              <li className={styles.navItem}>
                <a href="#" className={styles.navLink}>
                  О нас
                </a>
              </li>
              <li className={styles.navItem}>
                <a href="#" className={styles.navLink}>
                  Мастерская
                </a>
              </li>
              <li className={styles.navItem}>
                <a href="#" className={styles.navLink}>
                  Контакты
                </a>
              </li>
            </ul>
          </nav>
          <div className={styles.icons}>
            <img
              src="/img/magnifier.svg"
              alt="magnifier"
              width={28}
              height={28}
            />
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
              {cartItems.length > 0 && (
                <span className={styles.cartBadge}>{cartItems.length}</span>
              )}
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
            <div className={styles.userWrapper}>
              {user ? (
                <div className={styles.userMenu}>
                  <span className={styles.userName}>{user.name}</span>
                  <button onClick={onLogout} className={styles.logoutBtn}>
                    Выйти
                  </button>
                </div>
              ) : (
                <img
                  src="/img/user.svg"
                  alt="user"
                  width={28}
                  height={28}
                  onClick={() => setIsAuthOpen(true)}
                  className={styles.userIcon}
                />
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

export default Header;
