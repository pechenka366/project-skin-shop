import styles from "./Footer.module.scss";
import { Phone as FooterPhone } from "lucide-react";
import { Mail as FooterMail } from "lucide-react";
import { CircuitBoard as FooterBoard } from "lucide-react";

function Footer() {
  return (
    <section className={styles.footer}>
      <div className={styles.footerOur}>
        <div className={styles.footerName}>
          <h1 className={styles.footerLogo}>LEATHER CO.</h1>
          <p className={styles.footerInfo}>
            Изделия из натуральной кожи ручной работы
          </p>
        </div>
        <div className={styles.footerAbout}>
          <h1 className={styles.footerNaviName}>Навигация</h1>
          <button className={styles.footerCatalog}>Каталог</button>
          <button className={styles.footerAboutUs}>О нас</button>
          <button className={styles.footerMaster}>Мастерская</button>
          <button className={styles.footerContact}>Контакты</button>
        </div>
        <div className={styles.footerAbout}>
          <h1 className={styles.footerInformation}>Информация</h1>
          <button className={styles.footerTransfer}>Доставка</button>
          <button className={styles.footerPay}>Оплата</button>
          <button className={styles.footerGuarantee}>Гарантия</button>
          <button className={styles.footerCare}>Уход за изделиями</button>
        </div>
        <div className={styles.footerAbout}>
          <h1 className={styles.footerCont}>Контакты</h1>
          <div className={styles.footerMails}>
            <FooterPhone className={styles.footerImage} />
            <p className={styles.footerNumber}>+7 (495) 123-45-67</p>
          </div>
          <div className={styles.footerMails}>
            <FooterMail className={styles.footerImage} />
            <p className={styles.footerMail}>info@leatherco.ru</p>
          </div>
          <div className={styles.footerMails}>
            <FooterBoard className={styles.footerImage} />
            <p className={styles.footerInst}>@leatherco</p>
          </div>
        </div>
      </div>
      <div className={styles.footerRoot}>
        <p className={styles.footerRootName}>© 2026 LEATHER CO. Все права защищены.</p>
      </div>
    </section>
  );
}

export default Footer;
