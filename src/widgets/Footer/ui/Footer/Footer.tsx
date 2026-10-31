import { Link } from 'react-router-dom';
import logo from 'assets/brand/logo-07-blue.svg';
import landscape from 'assets/footer/macbook-meadow-1920.webp';
import largeLandscape from 'assets/footer/macbook-meadow-3840.webp';
import mobileLandscape from 'assets/footer/macbook-meadow-mobile.webp';
import { ROUTES } from 'shared/configs/routes';
import { SITE_VERSION } from 'shared/configs/version';
import FooterLink from './FooterLink';
import styles from './Footer.module.scss';

const Footer: React.FC = () => (
  <footer id="footer" className={styles.footer}>
    <picture className={styles.footer__landscape} aria-hidden="true">
      <source media="(max-width: 767px)" srcSet={mobileLandscape} width={768} height={1152} />
      <img
        src={landscape}
        srcSet={`${landscape} 1920w, ${largeLandscape} 3840w`}
        sizes="100vw"
        alt=""
        width={1920}
        height={960}
        loading="lazy"
        decoding="async"
      />
    </picture>
    <div className={styles.footer__wrapper}>
      <div className={styles.footer__content}>
        <div className={styles.footer__identity}>
          <img
            className={styles.footer__logo}
            src={logo}
            alt="andkiv"
            width={150}
            height={42}
            loading="lazy"
          />
          <p>
            Андрей Киверин
            <br />
            Frontend-разработчик
          </p>
        </div>
        <nav className={styles.footer__nav} aria-label="Ссылки в подвале">
          <div className={styles.footer__group}>
            <h2>Связаться</h2>
            <FooterLink href="mailto:kiverin03@yandex.ru">kiverin03@yandex.ru</FooterLink>
            <FooterLink href="tel:+79531370800">+7 (953) 137-08-00</FooterLink>
            <FooterLink href="https://t.me/andkiv" external>
              Телеграм
            </FooterLink>
          </div>
          <div className={styles.footer__group}>
            <h2>Площадки</h2>
            <FooterLink href="https://github.com/akiverin" external>
              GitHub
            </FooterLink>
            <FooterLink href="https://www.behance.net/kiverin03fb9c" external>
              Behance
            </FooterLink>
          </div>
          <div className={styles.footer__group}>
            <h2>Документы</h2>
            <Link to={ROUTES.TERMS} className={styles.footer__action}>
              Пользовательское соглашение
            </Link>
            <Link to={ROUTES.PRIVACY} className={styles.footer__action}>
              Политика конфиденциальности
            </Link>
          </div>
        </nav>
      </div>
      <div className={styles.footer__copyright}>
        <span>© 2026 Андрей Киверин</span>
        <span>Версия {SITE_VERSION}</span>
      </div>
    </div>
  </footer>
);

export default Footer;
