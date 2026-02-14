import styles from './HeroSection.module.scss';
import Text from 'shared/ui/Text';
import Image from 'next/image';
import heroBg from 'assets/heroBg.webp';
import AnimatedText from './AnimatedText';

const HeroSection: React.FC = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.hero__info}>
        <Text view="p-24" weight="medium" color="secondary" className={styles.hero__desc}>
          Добро пожаловать на веб сайт – портфолио с моими работами в веб-разработке и веб-дизайне.
        </Text>
        <AnimatedText text="Андрей Киверин" />
      </div>
      <div className={styles.hero__background}>
        <Image
          src={heroBg}
          className={styles.hero__image}
          alt="hero background"
          width={3000}
          height={1930}
          quality={100}
        />
      </div>
    </section>
  );
};

export default HeroSection;
