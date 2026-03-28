import styles from './HeroSection.module.scss';
import Text from 'shared/ui/Text';
import heroBg from 'assets/heroBg.webp';
import AnimatedText from './AnimatedText';

const HeroSection: React.FC = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.hero__info}>
        <Text view="p-18" weight="medium" color="secondary" className={styles.hero__desc}>
          Создаю цифровой опыт — от концепции до пикселя.
        </Text>
        <AnimatedText text="Андрей Киверин" />
      </div>
      <div className={styles.hero__background}>
        <img
          src={heroBg}
          className={styles.hero__image}
          alt="Фоновое изображение портфолио"
          fetchPriority="high"
        />
      </div>
    </section>
  );
};

export default HeroSection;
