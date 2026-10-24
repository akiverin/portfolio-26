import { Link } from 'react-router-dom';
import Text from 'shared/ui/Text';
import styles from './Footer.module.scss';
import { ROUTES } from 'shared/configs/routes';
import FadeIn from 'shared/ui/FadeIn';
import { IconBrandTelegram } from '@tabler/icons-react';
import FooterLink from './FooterLink';

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <FadeIn distance={15} duration={0.5}>
        <div className={styles.footer__wrapper}>
          <Text view="p-20" weight="medium" className={styles.footer__copyright}>
            Москва 2026
          </Text>
          <div className={styles.footer__infoBlock}>
            <Text color="secondary" view="p-20" weight="medium">
              связаться
            </Text>
            <FooterLink href="mailto:kiverin03@yandex.ru">kiverin03@yandex.ru</FooterLink>
            <FooterLink href="tel:+79531370800">+7 (953) 137-08-00</FooterLink>
            <FooterLink
              href="https://t.me/andkiv"
              external
              icon={<IconBrandTelegram size={20} stroke={1.6} aria-hidden="true" />}
            >
              Телеграм
            </FooterLink>
          </div>
          <div className={styles.footer__infoBlock}>
            <Text color="secondary" view="p-20" weight="medium">
              мои площадки
            </Text>
            <FooterLink href="https://github.com/akiverin" external>
              GitHub
            </FooterLink>
            <FooterLink href="https://www.behance.net/kiverin03fb9c" external>
              Behance
            </FooterLink>
          </div>
          <div className={styles.footer__infoBlock}>
            <Link to={ROUTES.TERMS} className={styles.footer__link}>
              <Text view="p-14" color="secondary">
                Пользовательское соглашение
              </Text>
            </Link>
            <Link to={ROUTES.PRIVACY} className={styles.footer__link}>
              <Text view="p-14" color="secondary">
                Политика конфиденциальности
              </Text>
            </Link>
          </div>
        </div>
      </FadeIn>
    </footer>
  );
};

export default Footer;
