import { Link } from 'react-router-dom';
import Text from 'shared/ui/Text';
import styles from './Footer.module.scss';
import Button from 'shared/ui/Button';
import { ROUTES } from 'shared/configs/routes';
import FadeIn from 'shared/ui/FadeIn';

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <FadeIn distance={15} duration={0.5}>
        <div className={styles.footer__wrapper}>
          <Text view="p-20" weight="medium">
            Москва 2026
          </Text>
          <div className={styles.footer__infoBlock}>
            <Text color="secondary" view="p-20" weight="medium">
              связаться
            </Text>
            <Button href="mailto:kiverin03@yandex.ru" target="_blank" noPadding>
              <Text view="p-20" weight="medium">
                kiverin03@yandex.ru
              </Text>
            </Button>
            <Button href="tel:89531370800" target="_blank" noPadding>
              <Text view="p-20" weight="medium">
                +7 (953) 137-08-00
              </Text>
            </Button>
            <Button href="https://t.me/andkiv" target="_blank" noPadding>
              <Text view="p-20" weight="medium">
                Телеграм
              </Text>
            </Button>
          </div>
          <div className={styles.footer__infoBlock}>
            <Text color="secondary" view="p-20" weight="medium">
              мои площадки
            </Text>
            <Button href="https://github.com/akiverin" target="_blank" noPadding>
              <Text view="p-20" weight="medium">
                Github
              </Text>
            </Button>
            <Button href="https://www.behance.net/kiverin03fb9c" target="_blank" noPadding>
              <Text view="p-20" weight="medium">
                Behance
              </Text>
            </Button>
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
