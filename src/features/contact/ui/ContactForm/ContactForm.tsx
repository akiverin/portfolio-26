import React from 'react';
import { observer } from 'mobx-react-lite';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  IconArrowUpRight,
  IconAt,
  IconCheck,
  IconSend,
  IconUser,
} from '@tabler/icons-react';
import styles from './ContactForm.module.scss';
import Text from 'shared/ui/Text';
import Input from 'shared/ui/Input';
import Textarea from 'shared/ui/Textarea';
import Button from 'shared/ui/Button';
import { ContactFormStore } from 'features/contact/model/ContactFormStore';
import { useLocalStore } from 'shared/hooks/useLocalStore';
import { Meta } from 'shared/lib/meta';
import { ROUTES } from 'shared/configs/routes';

const PROJECT_TYPES = [
  { value: 'website', label: 'Сайт' },
  { value: 'product', label: 'Веб-продукт' },
  { value: 'design', label: 'UI/UX дизайн' },
  { value: 'other', label: 'Другое' },
] as const;

const MESSAGE_LIMIT = 1200;

const ContactForm: React.FC = observer(() => {
  const form = useLocalStore(() => new ContactFormStore());

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await form.submit();
  };

  if (form.meta === Meta.success) {
    return (
      <motion.div
        className={styles.contact__success}
        initial={{ opacity: 0, scale: 0.94, y: 18 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 22, stiffness: 150 }}
      >
        <motion.div
          className={styles.contact__checkmark}
          initial={{ rotate: -20, scale: 0 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ type: 'spring', delay: 0.12, stiffness: 180 }}
        >
          <IconCheck size={32} stroke={2} />
        </motion.div>
        <div className={styles.contact__successCopy}>
          <Text tag="p" view="p-28" weight="bold">
            Сообщение уже у меня
          </Text>
          <Text tag="p" view="p-16">
            Спасибо! Изучу задачу и отвечу в ближайшее время.
          </Text>
        </div>
        <Button onClick={() => form.reset()} className={styles.contact__againButton}>
          <Text view="p-14" weight="medium">
            Написать ещё
          </Text>
          <IconArrowUpRight size={17} />
        </Button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={styles.contact__form} noValidate>
      <div className={styles.contact__formHeader}>
        <div>
          <span className={styles.contact__formIndex}>Форма заявки · 01</span>
          <Text tag="h3" view="p-24" weight="bold" className={styles.contact__formTitle}>
            Расскажите о задаче
          </Text>
        </div>
        <IconSend className={styles.contact__formIcon} size={24} stroke={1.4} />
      </div>

      <fieldset className={styles.contact__projectFieldset}>
        <legend>Что нужно сделать?</legend>
        <div className={styles.contact__projectTypes}>
          {PROJECT_TYPES.map((type) => (
            <label
              key={type.value}
              className={
                form.projectType === type.value
                  ? `${styles.contact__projectType} ${styles['contact__projectType--active']}`
                  : styles.contact__projectType
              }
            >
              <input
                type="radio"
                name="projectType"
                value={type.value}
                checked={form.projectType === type.value}
                onChange={(event) => form.setField('projectType', event.target.value)}
              />
              <span>{type.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className={styles.contact__fields}>
        <div className={styles.contact__row}>
          <div className={styles.contact__field}>
            <Text tag="label" view="p-12" weight="medium" htmlFor="contact-name">
              Как к вам обращаться?
            </Text>
            <Input
              id="contact-name"
              value={form.name}
              onChange={(value) => form.setField('name', value)}
              placeholder="Ваше имя"
              autoComplete="name"
              aria-invalid={Boolean(form.errors.name)}
              aria-describedby={form.errors.name ? 'contact-name-error' : undefined}
              afterSlot={<IconUser size={18} stroke={1.5} aria-hidden="true" />}
            />
            {form.errors.name && (
              <Text id="contact-name-error" view="p-12" color="accent" role="alert">
                {form.errors.name}
              </Text>
            )}
          </div>
          <div className={styles.contact__field}>
            <Text tag="label" view="p-12" weight="medium" htmlFor="contact-email">
              Куда ответить?
            </Text>
            <Input
              id="contact-email"
              type="email"
              value={form.email}
              onChange={(value) => form.setField('email', value)}
              placeholder="your@email.com"
              autoComplete="email"
              aria-invalid={Boolean(form.errors.email)}
              aria-describedby={form.errors.email ? 'contact-email-error' : undefined}
              afterSlot={<IconAt size={18} stroke={1.5} aria-hidden="true" />}
            />
            {form.errors.email && (
              <Text id="contact-email-error" view="p-12" color="accent" role="alert">
                {form.errors.email}
              </Text>
            )}
          </div>
        </div>

        <div className={styles.contact__field}>
          <div className={styles.contact__messageLabel}>
            <Text tag="label" view="p-12" weight="medium" htmlFor="contact-message">
              О проекте
            </Text>
            <span>{form.message.length} / {MESSAGE_LIMIT}</span>
          </div>
          <Textarea
            id="contact-message"
            value={form.message}
            onChange={(value) => form.setField('message', value)}
            placeholder="Что хотите создать, для кого и какой результат ожидаете?"
            rows={6}
            maxLength={MESSAGE_LIMIT}
            aria-invalid={Boolean(form.errors.message)}
            aria-describedby={form.errors.message ? 'contact-message-error' : undefined}
          />
          {form.errors.message && (
            <Text id="contact-message-error" view="p-12" color="accent" role="alert">
              {form.errors.message}
            </Text>
          )}
        </div>
      </div>

      {form.meta === Meta.error && (
        <div className={styles.contact__error} role="alert">
          Не удалось отправить сообщение. Проверьте соединение и попробуйте ещё раз.
        </div>
      )}

      <div className={styles.contact__actions}>
        <Button
          type="submit"
          theme="accent"
          loading={form.meta === Meta.loading}
          className={styles.contact__submit}
        >
          <Text view="p-16" weight="medium">
            Отправить заявку
          </Text>
          <IconArrowUpRight size={18} stroke={1.8} />
        </Button>
        <Text tag="p" view="p-10" className={styles.contact__legal}>
          Нажимая кнопку, вы соглашаетесь с{' '}
          <Link to={ROUTES.PRIVACY}>политикой конфиденциальности</Link>
        </Text>
      </div>
    </form>
  );
});

export default ContactForm;
