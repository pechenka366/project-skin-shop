import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Header.module.scss";
import Cart from "../Cart/index";
import AuthModal from "../AuthModal/index";
import { LogOut, UserCircle, LayoutDashboard } from "lucide-react";
import type { User } from "../../types"; 

interface HeaderProps {
  onCartClick: () => void;
  isCartOpen: boolean;
  cartItems: any[];
  onRemoveFromCart: (id: string) => void;
  user: User | null; 
  onLogout: () => void;
  onLogin: (userData: User) => void;  
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
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const getInitial = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : "?";
  };

  return (
    <>
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLogin={(userData) => {
          onLogin(userData as User);
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
                <Link
                  to="/"
                  className={styles.navLink}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Каталог
                </Link>
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
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className={styles.userAvatar}
                      />
                    ) : (
                      <div className={styles.userAvatar}>
                        {getInitial(user.name)}
                      </div>
                    )}
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
                <div
                  className={styles.userMenuDesktop}
                  onMouseEnter={() => setIsUserMenuOpen(true)}
                  onMouseLeave={() => setIsUserMenuOpen(false)}
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className={styles.userAvatarDesktop}
                    />
                  ) : (
                    <div className={styles.userAvatarDesktop}>
                      {getInitial(user.name)}
                    </div>
                  )}
                  <span className={styles.userNameDesktop}>{user.name}</span>
                  {isUserMenuOpen && (
                    <div className={styles.dropdownMenu}>
                      <Link to="/profile" className={styles.dropdownItem}>
                        <UserCircle size={18} />
                        <span>Профиль</span>
                      </Link>
                      {user.role === 'admin' && (
                        <Link to="/admin" className={styles.dropdownItem}>
                          <LayoutDashboard size={18} />
                          <span>Админ панель</span>
                        </Link>
                      )}
                      <button onClick={onLogout} className={styles.dropdownItem}>
                        <LogOut size={18} />
                        <span>Выйти</span>
                      </button>
                    </div>
                  )}
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