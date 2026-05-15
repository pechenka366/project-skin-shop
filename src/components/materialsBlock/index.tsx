import styles from "./MaterialsBlock.module.scss";

function MaterialsBlock() {
  return (
    <section className={styles.materials}>
      <div className={styles.marerialsContainer}>
        <h3 className={styles.marerialsTitle}>Наша коллекция</h3>
        <h1 className={styles.marerialsName}>Премиальная натуральная кожа</h1>
        <p className={styles.marerialsText}>Мы тщательно отбираем лучшие сорта кожи для каждого изделия</p>
      </div>
      <div className={styles.materialsGallery}>
        <div className={styles.left}>
          <img src="/img/img.svg" alt="img-materials" />
        </div>
        <div className={styles.right}>
          <div className={styles.rightTop}>
            <div className={styles.firstImage}>
              <img className={styles.rightTopleft} src="/img/aboutImg.jpg" alt="/img/img.svg"/>
            </div>
            <div className={styles.twelveImage}>
              <img className={styles.rightTopright} src="/img/aboutImg.jpg" alt="/img/img.svg"/>
            </div>
          </div>
          <div className={styles.rightBottom}>
            <div className={styles.secondImage}>
              <img className={styles.rightBottomLeft} src="/img/aboutImg.jpg" alt="/img/img.svg"/>
            </div>
            <div className={styles.fourthImage}>
              <img className={styles.rightBottomRight} src="/img/aboutImg.jpg" alt="/img/img.svg"/>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default MaterialsBlock;
