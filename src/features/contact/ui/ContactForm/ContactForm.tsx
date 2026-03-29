import React from 'react';
import { observer } from 'mobx-react-lite';
import { motion } from 'framer-motion';
import styles from './ContactForm.module.scss';
import Text from 'shared/ui/Text';
import Input from 'shared/ui/Input';
import Textarea from 'shared/ui/Textarea';
import Button from 'shared/ui/Button';
import { ContactFormStore } from 'features/contact/model/ContactFormStore';
import { useLocalStore } from 'shared/hooks/useLocalStore';
import { Meta } from 'shared/lib/meta';
import { IconCheck } from '@tabler/icons-react';

const ContactForm: React.FC = observer(() => {
  const form = useLocalStore(() => new ContactFormStore());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await form.submit();
  };

  if (form.meta === Meta.success) {
    return (
      <motion.div
        className={styles.contact__success}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', damping: 20, stiffness: 150 }}
      >
        <div className={styles.contact__checkmark}>
          <IconCheck size={32} stroke={2} />
        </div>
        <Text tag="p" view="p-24" weight="bold">
          Спасибо!
        </Text>
        <Text tag="p" view="p-16" color="secondary">
          Ваше сообщение отправлено. Я свяжусь с вами в ближайшее время.
        </Text>
        <Button onClick={() => form.reset()}>
          <Text view="p-16" weight="medium">
            Отправить ещё
          </Text>
        </Button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={styles.contact__form}>
      <Text tag="p" view="p-18" weight="bold" className={styles.contact__formTitle}>
        Напишите мне
      </Text>

      <div className={styles.contact__fields}>
        <div className={styles.contact__row}>
          <div className={styles.contact__field}>
            <Text tag="label" view="p-12" weight="medium" color="secondary" htmlFor="contact-name">
              Имя
            </Text>
            <Input
              id="contact-name"
              value={form.name}
              onChange={(v) => form.setField('name', v)}
              placeholder="Ваше имя"
            />
            {form.errors.name && (
              <Text view="p-12" color="accent">
                {form.errors.name}
              </Text>
            )}
          </div>
          <div className={styles.contact__field}>
            <Text tag="label" view="p-12" weight="medium" color="secondary" htmlFor="contact-email">
              Email
            </Text>
            <Input
              id="contact-email"
              type="email"
              value={form.email}
              onChange={(v) => form.setField('email', v)}
              placeholder="your@email.com"
            />
            {form.errors.email && (
              <Text view="p-12" color="accent">
                {form.errors.email}
              </Text>
            )}
          </div>
        </div>

        <div className={styles.contact__field}>
          <Text tag="label" view="p-12" weight="medium" color="secondary" htmlFor="contact-message">
            Сообщение
          </Text>
          <Textarea
            id="contact-message"
            value={form.message}
            onChange={(v) => form.setField('message', v)}
            placeholder="Расскажите о вашем проекте или задайте вопрос..."
            rows={5}
          />
          {form.errors.message && (
            <Text view="p-12" color="accent">
              {form.errors.message}
            </Text>
          )}
        </div>
      </div>

      {form.meta === Meta.error && (
        <Text view="p-14" color="accent">
          Произошла ошибка при отправке. Попробуйте ещё раз.
        </Text>
      )}

      <div className={styles.contact__actions}>
        <Button type="submit" theme="accent" loading={form.meta === Meta.loading}>
          <Text view="p-16" weight="medium">
            Отправить сообщение
          </Text>
        </Button>
      </div>
    </form>
  );
});

export default ContactForm;
