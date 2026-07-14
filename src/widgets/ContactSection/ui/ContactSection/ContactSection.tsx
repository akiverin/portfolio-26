import { motion } from 'framer-motion';
import styles from './ContactSection.module.scss';
import Text from 'shared/ui/Text';
import ContactForm from 'features/contact/ui/ContactForm';
import {
  IconArrowUpRight,
  IconBrandTelegram,
  IconClock,
  IconMail,
  IconPhone,
  IconSparkles,
} from '@tabler/icons-react';

const SOCIALS = [
  {
    href: 'mailto:kiverin03@yandex.ru',
    icon: IconMail,
    type: 'Email',
    label: 'kiverin03@yandex.ru',
  },
  {
    href: 'https://t.me/andkiv',
    icon: IconBrandTelegram,
    type: 'Telegram',
    label: '@andkiv',
  },
  {
    href: 'tel:89531370800',
    icon: IconPhone,
    type: 'Телефон',
    label: '+7 (953) 137-08-00',
  },
] as const;

const sectionVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 } as const,
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, damping: 25, stiffness: 120 },
  },
};

const ContactSection: React.FC = () => {
  return (
    <section className={styles.contact} id="contact">
      <motion.div
        className={styles.contact__header}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <Text
          font="caveat"
          view="p-24"
          weight="medium"
          color="secondary"
          className={styles.contact__subtitle}
        >
          напишите мне
        </Text>
        <Text tag="h2" view="title" weight="black" uppercase>
          Связаться
        </Text>
      </motion.div>

      <motion.div
        className={styles.contact__container}
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
      >
        <div className={styles.contact__background} aria-hidden="true">
          <div className={styles.contact__mesh} />
          <div className={styles.contact__orbit} />
          <span className={styles.contact__backgroundWord}>LET'S TALK</span>
        </div>

        <motion.div className={styles.contact__intro} variants={itemVariants}>
          <div className={styles.contact__introTop}>
            <span className={styles.contact__eyebrow}>
              <IconSparkles size={15} /> Новая задача начинается здесь
            </span>
            <Text tag="h3" view="p-32" weight="bold" className={styles.contact__introTitle}>
              Давайте создадим продукт, который хочется использовать.
            </Text>
            <Text tag="p" view="p-16" className={styles.contact__introText}>
              Расскажите об идее, задаче или продукте. Помогу найти ясную форму и превратить её в
              работающий цифровой опыт.
            </Text>
          </div>

          <div className={styles.contact__responseCard}>
            <span className={styles.contact__responseIcon}>
              <IconClock size={18} stroke={1.6} />
            </span>
            <div>
              <Text tag="span" view="p-12" weight="medium">
                Обычно отвечаю в течение дня
              </Text>
              <Text tag="span" view="p-10" className={styles.contact__responseMeta}>
                Будни · 10:00–20:00 МСК
              </Text>
            </div>
          </div>

          <div className={styles.contact__socials}>
            {SOCIALS.map(({ href, icon: Icon, type, label }) => (
              <motion.a
                key={href}
                href={href}
                target={href.startsWith('https') ? '_blank' : undefined}
                rel={href.startsWith('https') ? 'noopener noreferrer' : undefined}
                className={styles.contact__socialLink}
                variants={itemVariants}
                whileHover={{ x: 5 }}
              >
                <span className={styles.contact__socialIcon}>
                  <Icon size={19} stroke={1.5} />
                </span>
                <span className={styles.contact__socialCopy}>
                  <small>{type}</small>
                  <Text tag="span" view="p-14" weight="medium">
                    {label}
                  </Text>
                </span>
                <IconArrowUpRight className={styles.contact__socialArrow} size={17} stroke={1.5} />
              </motion.a>
            ))}
          </div>

          <div className={styles.contact__signature} aria-hidden="true">
            <span>AK</span>
            <span>Portfolio · 2026</span>
          </div>
        </motion.div>

        <motion.div className={styles.contact__formWrapper} variants={itemVariants}>
          <ContactForm />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default ContactSection;
