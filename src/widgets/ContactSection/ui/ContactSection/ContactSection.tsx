'use client';

import styles from './ContactSection.module.scss';
import Text from 'shared/ui/Text';
import ContactForm from 'features/contact/ui/ContactForm';

const ContactSection: React.FC = () => {
  return (
    <section className={styles.contact} id="contact">
      <div className={styles.contact__header}>
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
      </div>

      <div className={styles.contact__container}>
        <div className={styles.contact__intro}>
          <Text tag="p" view="p-18">
            Если у вас есть вопрос, предложение или просто хотите пообщаться — напишите мне.
          </Text>
          <Text tag="p" view="p-18">
            Буду рад ответить!
          </Text>
        </div>

        <ContactForm />
      </div>
    </section>
  );
};

export default ContactSection;
