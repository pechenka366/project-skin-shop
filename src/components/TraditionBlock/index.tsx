import styles from "./TraditionBlock.module.scss";

function TraditionBlock() {
  return (
    <section className={styles.tradition}>
      <div className={styles.traditionContainer}>
        <div className={styles.traditionLeft}>
          <p className={styles.traditionLabel}>Наше мастерство</p>

          <h1 className={styles.traditionTitle}>Традиции и качество</h1>

          <p className={styles.traditionDescription1}>
            Более 15 лет мы создаем изделия из натуральной кожи, сочетая
            традиционные методы обработки с современным дизайном.
          </p>

          <p className={styles.traditionDescription}>
            Каждый шов, каждая деталь — результат внимательной ручной работы
            наших мастеров. Мы используем только премиальную кожу от проверенных
            поставщиков и не идем на компромиссы в вопросах качества.
          </p>
          <div className={styles.traditionLeftBottom}>
            <div className={styles.traditionFifty}>
              <h1 className={styles.traditionName}>15+</h1>
              <p className={styles.traditionText}>лет опыта</p>
            </div>
            <div className={styles.traditionOnehundred}>
              <h1 className={styles.traditionName}>100%</h1>
              <p className={styles.traditionText}>ручная работа</p>
            </div>
            <div className={styles.traditionThousand}>
              <h1 className={styles.traditionName}>5000+</h1>
              <p className={styles.traditionText}>изделий</p>
            </div>
          </div>
        </div>

        <div className={styles.traditionRight}>
          <div className={`${styles.traditionColumn} ${styles.left}`}>
            <div className={`${styles.card} ${styles.card1}`}>
              <img
                src="/img/mainImg.jpg"
                alt="/img/img.svg"
                className={styles.placeholder}
              />
            </div>

            <div className={`${styles.card} ${styles.card3}`}>
              <img
                src="/img/mainImg2.jpg"
                alt="/img/img.svg"
                className={styles.placeholder}
              />
            </div>
          </div>

          <div className={`${styles.traditionColumn} ${styles.right}`}>
            <div className={`${styles.card} ${styles.card2}`}>
              <img
                src="/img/mainImg3.jpg"
                alt="/img/img.svg"
                className={styles.placeholder}
              />
            </div>

            <div className={`${styles.card} ${styles.card4}`}>
              <img
                src="/img/mainImg4.jpg"
                alt="/img/img.svg"
                className={styles.placeholder}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TraditionBlock;
