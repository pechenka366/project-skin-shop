import styles from "./Main.module.scss";

function Main() {
  return (
    <section className={styles.hero}>
      <div className={styles.heroContainer}>
        <div className={styles.heroLeft}>
          <p className={styles.heroLabel}>Ручная работа</p>

          <h1 className={styles.heroTitle}>
            Изделия из натуральной кожи
          </h1>

          <p className={styles.heroDescription}>
            Эксклюзивные кожаные аксессуары, созданные с любовью к деталям и
            традициям мастерства
          </p>

          <div className={styles.heroButtons}>
            <button className={styles.primaryBtn}>Смотреть каталог →</button>

            <button className={styles.secondaryBtn}>О мастерской</button>
          </div>
        </div>

        <div className={styles.heroRight}>
          <div className={`${styles.heroColumn} ${styles.left}`}>
            <div className={`${styles.card} ${styles.card1}`}>
              <img src="/img/mainImg.jpg" alt="/img/img.svg" className={styles.placeholder} />
            </div>

            <div className={`${styles.card} ${styles.card3}`}>
              <img src="/img/mainImg2.jpg" alt="/img/img.svg" className={styles.placeholder} />
            </div>
          </div>

          <div className={`${styles.heroColumn} ${styles.right}`}>
            <div className={`${styles.card} ${styles.card2}`}>
              <img src="/img/mainImg3.jpg" alt="/img/img.svg" className={styles.placeholder} />
            </div>

            <div className={`${styles.card} ${styles.card4}`}>
              <img src="/img/mainImg4.jpg" alt="/img/img.svg" className={styles.placeholder} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Main;