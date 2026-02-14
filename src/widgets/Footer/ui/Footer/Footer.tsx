import Text from 'shared/ui/Text';
import styles from './Footer.module.scss';
import Button from 'shared/ui/Button';

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
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
        <Text view="p-20" weight="medium">
          Все права сохранены
        </Text>
      </div>
    </footer>
  );
};

export default Footer;
