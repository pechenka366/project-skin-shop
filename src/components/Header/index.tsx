import styles from "./Header.module.scss";

function Header() {
  return (
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
          <img src="/img/bag.svg" alt="bag" width={28} height={28} />
        </div>
      </div>
    </header>
  );
}

export default Header;
