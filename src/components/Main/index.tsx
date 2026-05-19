import { useState, useEffect } from "react";
import styles from "./Main.module.scss";
import ContentLoader from "react-content-loader";

function Main() {
  const [loadedImages, setLoadedImages] = useState({
    img1: false,
    img2: false,
    img3: false,
    img4: false,
  });

  const [showSkeleton, setShowSkeleton] = useState({
    img1: true,
    img2: true,
    img3: true,
    img4: true,
  });

  const images = [
    { key: "img1", src: "/img/mainImg.jpg", card: "card1", column: "left" },
    { key: "img2", src: "/img/mainImg2.jpg", card: "card3", column: "left" },
    { key: "img3", src: "/img/mainImg3.jpg", card: "card2", column: "right" },
    { key: "img4", src: "/img/mainImg4.jpg", card: "card4", column: "right" },
  ];

  useEffect(() => {
    images.forEach((img) => {
      const image = new Image();
      image.src = img.src;
      image.onload = () => {
        setTimeout(() => {
          setLoadedImages((prev) => ({ ...prev, [img.key]: true }));
          setShowSkeleton((prev) => ({ ...prev, [img.key]: false }));
        }, 300);
      };
    });
  }, []);

  const renderSkeleton = (height: number) => (
    <ContentLoader
      speed={1}
      width={320}
      height={height}
      viewBox={`0 0 320 ${height}`}
      backgroundColor="#e0e0e0"
      foregroundColor="#f5f5f5"
    >
      <rect x="0" y="0" rx="10" ry="" width="320" height={height} />
    </ContentLoader>
  );

  return (
    <section className={styles.hero}>
      <div className={styles.heroContainer}>
        <div className={styles.heroLeft}>
          <p className={styles.heroLabel}>Ручная работа</p>
          <h1 className={styles.heroTitle}>Изделия из натуральной кожи</h1>
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
              {showSkeleton.img1 && renderSkeleton(430)}
              {loadedImages.img1 && (
                <img
                  src="/img/mainImg.jpg"
                  alt="img-main"
                  className={styles.placeholder}
                />
              )}
            </div>
            <div className={`${styles.card} ${styles.card3}`}>
              {showSkeleton.img2 && renderSkeleton(360)}
              {loadedImages.img2 && (
                <img
                  src="/img/mainImg2.jpg"
                  alt="img-main"
                  className={styles.placeholder}
                />
              )}
            </div>
          </div>

          <div className={`${styles.heroColumn} ${styles.right}`}>
            <div className={`${styles.card} ${styles.card2}`}>
              {showSkeleton.img3 && renderSkeleton(320)}
              {loadedImages.img3 && (
                <img
                  src="/img/mainImg3.jpg"
                  alt="img-main"
                  className={styles.placeholder}
                />
              )}
            </div>
            <div className={`${styles.card} ${styles.card4}`}>
              {showSkeleton.img4 && renderSkeleton(430)}
              {loadedImages.img4 && (
                <img
                  src="/img/mainImg4.jpg"
                  alt="img-main"
                  className={styles.placeholder}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Main;