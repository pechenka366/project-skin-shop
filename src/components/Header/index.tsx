import styles from "./Header.module.scss";
import Cart from "../Cart/index";
import { useState } from "react";
import AuthModal from "../AuthModal/index";
import { Link } from "react-router-dom";

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
          <Link to="/">
            <span className={styles.logo}>KOVAC</span>
          </Link>

          <button
            className={`${styles.burger} ${isMobileMenuOpen ? styles.open : ""}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <nav
            className={`${styles.nav} ${isMobileMenuOpen ? styles.mobileOpen : ""}`}
          >
            <ul className={styles.navList}>
              <li className={styles.navItem}>
                <a
                  href="/"
                  className={styles.navLink}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Каталог
                </a>
              </li>
              <li className={styles.navItem}>
                <a
                  href="#"
                  className={styles.navLink}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  О нас
                </a>
              </li>
              <li className={styles.navItem}>
                <a
                  href="#"
                  className={styles.navLink}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Мастерская
                </a>
              </li>
              <li className={styles.navItem}>
                <a
                  href="#"
                  className={styles.navLink}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Контакты
                </a>
              </li>
            </ul>
            <div className={styles.mobileIcons}>
              <div className={styles.userWrapper}>
                {user ? (
                  <div className={styles.userMenu}>
                    <span className={styles.userName}>{user.name}</span>
                    <button onClick={onLogout} className={styles.logoutBtn}>
                      Выйти
                    </button>
                  </div>
                ) : (
                  <button
                    className={styles.mobileAuthBtn}
                    onClick={() => {
                      setIsAuthOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Войти
                  </button>
                )}
              </div>
            </div>
          </nav>

          <div className={styles.icons}>
            <img
              src="/img/magnifier.svg"
              alt="magnifier"
              width={28}
              height={28}
              className={styles.icon}
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
            <div className={styles.userWrapperDesktop}>
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
