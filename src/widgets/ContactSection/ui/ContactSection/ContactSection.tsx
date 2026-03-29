import { motion } from 'framer-motion';
import styles from './ContactSection.module.scss';
import Text from 'shared/ui/Text';
import ContactForm from 'features/contact/ui/ContactForm';
import { IconBrandTelegram, IconMail, IconPhone } from '@tabler/icons-react';

const socials = [
  {
    href: 'mailto:kiverin03@yandex.ru',
    icon: IconMail,
    label: 'kiverin03@yandex.ru',
  },
  {
    href: 'https://t.me/andkiv',
    icon: IconBrandTelegram,
    label: 'Телеграм',
  },
  {
    href: 'tel:89531370800',
    icon: IconPhone,
    label: '+7 (953) 137-08-00',
  },
];

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
        <div className={styles.contact__glow} />
        <div className={styles.contact__glow2} />

        <motion.div className={styles.contact__intro} variants={itemVariants}>
          <Text tag="h3" view="p-28" weight="bold" className={styles.contact__introTitle}>
            Давайте работать вместе
          </Text>
          <Text tag="p" view="p-16" className={styles.contact__introText}>
            Если у вас есть вопрос, предложение о сотрудничестве или просто хотите
            пообщаться — напишите мне. Буду рад ответить!
          </Text>

          <div className={styles.contact__socials}>
            {socials.map(({ href, icon: Icon, label }) => (
              <motion.a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.contact__socialLink}
                variants={itemVariants}
              >
                <Icon className={styles.contact__socialIcon} stroke={1.5} />
                <Text view="p-14" weight="medium">
                  {label}
                </Text>
              </motion.a>
            ))}
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
