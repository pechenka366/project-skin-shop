import styles from './About.module.scss';

function About() {
  return (
    <section className={styles.about}>
      <div className={styles.aboutContainer}>
        <div className={styles.aboutGallery}>
          <div className={`${styles.aboutCard} ${styles.cardLarge}`}>
            <img className={styles.placeholder} src="/img/img.svg" alt="img-main" />
          </div>
          <div className={`${styles.aboutCard} ${styles.cardMedium}`}>
            <img className={styles.placeholder} src="/img/img.svg" alt="img-main" />
          </div>
        </div>
        <div className={styles.aboutContent}>
          <p className={styles.aboutLabel}>О нашем бренде</p>
          <h2 className={styles.aboutTitle}>Страсть к качеству</h2>

          <p className={styles.aboutText}>
            Более 15 лет мы создаем уникальные изделия из натуральной кожи.
            Каждая сумка, каждый аксессуар — это результат кропотливой ручной
            работы и безграничной любви к своему делу.
          </p>
          <p className={`${styles.aboutText} ${styles.second}`}>
            Мы не просто продаем кожаные изделия — мы создаем спутников на
            долгие годы, которые будут радовать вас своим качеством и
            становиться лучше со временем.
          </p>
          <div className={styles.aboutStats}>
            <div className={styles.statCard}>
              <h3>100%</h3>
              <span>Натуральная кожа</span>
            </div>
            <div className={styles.statCard}>
              <h3>15+</h3>
              <span>Лет мастерства</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;