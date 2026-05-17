import styles from "./InfoBlock.module.scss";
import { Medal as InfoMedal } from "lucide-react";
import { Heart as InfoHeart } from "lucide-react";
import { ShieldCheck as InfoProtect } from "lucide-react";
import { Van as InfoTruck } from "lucide-react";

function InfoBlock() {
  return (
    <section className={styles.info}>
      <div className={styles.infoBlock}>
        <div className={styles.infoMedal}>
            <InfoMedal className={styles.image} />
            <h1 className={styles.infoName}>Премиум качество</h1>
            <p className={styles.infoText}>Только натуральная кожа высшего сорта от проверенных поставщиков</p>
        </div>
        <div className={styles.infoHeart}>
            <InfoHeart className={styles.image} />
            <h1 className={styles.infoName}>Ручная работа</h1>
            <p className={styles.infoText}>Каждое изделие создается вручную опытными мастерами</p>
        </div>
        <div className={styles.infoProtect}>
            <InfoProtect className={styles.image} />
            <h1 className={styles.infoName}>Гарантия 2 года</h1>
            <p className={styles.infoText}>Уверенность в качестве позволяет нам давать длительную гарантию</p>
        </div>
        <div className={styles.infoTruck}>
            <InfoTruck className={styles.image} />
            <h1 className={styles.infoName}>Доставка по России</h1>
            <p className={styles.infoText}>Бесплатная доставка при заказе от <br/> 10 000 рублей</p>
        </div>
      </div>
    </section>
  );
}

export default InfoBlock;
