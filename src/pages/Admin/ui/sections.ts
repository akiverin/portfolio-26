import React from 'react';
import { ColumnDef, FieldDef } from 'features/admin/model/types';

export type AdminSection = {
  key: string;
  label: string;
  collection: string;
  icon: string;
  columns: ColumnDef[];
  fields: FieldDef[];
};

export const ADMIN_SECTIONS: AdminSection[] = [
  {
    key: 'users',
    label: 'Пользователи',
    collection: 'users',
    icon: 'users',
    columns: [
      { key: 'displayName', label: 'Имя', sortable: true, editable: true, minWidth: '160px' },
      { key: 'email', label: 'Email', sortable: true, editable: true, type: 'email', minWidth: '200px' },
      { key: 'photoURL', label: 'Фото', type: 'image', minWidth: '80px' },
      { key: 'createdAt', label: 'Дата регистрации', sortable: true, type: 'timestamp', minWidth: '150px' },
    ],
    fields: [
      { key: 'displayName', label: 'Имя', type: 'text', required: true, placeholder: 'Введите имя' },
      { key: 'email', label: 'Email', type: 'email', required: true, placeholder: 'user@email.com' },
      { key: 'photoURL', label: 'Фото (URL)', type: 'url', placeholder: 'https://...' },
    ],
  },
  {
    key: 'projects',
    label: 'Проекты',
    collection: 'projects',
    icon: 'folder',
    columns: [
      { key: 'title', label: 'Название', sortable: true, editable: true, minWidth: '180px' },
      { key: 'desc', label: 'Описание', sortable: false, editable: true, minWidth: '220px' },
      {
        key: 'cover',
        label: 'Обложка',
        type: 'image',
        minWidth: '80px',
        render: (val) =>
          val
            ? React.createElement('img', {
                src: `https://andkiv.com/assets/projects/${val}`,
                alt: '',
                style: { width: 32, height: 32, borderRadius: 6, objectFit: 'cover' },
              })
            : '—',
      },
      { key: 'coverType', label: 'Тип обложки', sortable: true, editable: true, minWidth: '120px' },
      { key: 'date', label: 'Дата', sortable: true, type: 'timestamp', minWidth: '120px' },
      { key: 'link', label: 'Ссылка', type: 'url', editable: true, minWidth: '160px' },
      { key: 'github', label: 'GitHub', type: 'url', editable: true, minWidth: '160px' },
      { key: 'disabled', label: 'Отключена', sortable: true, editable: true, minWidth: '100px' },
    ],
    fields: [
      { key: 'title', label: 'Название', type: 'text', required: true, placeholder: 'Название проекта' },
      { key: 'desc', label: 'Описание', type: 'textarea', required: true, placeholder: 'Описание проекта' },
      { key: 'cover', label: 'Обложка (URL)', type: 'url', placeholder: 'https://...' },
      { key: 'coverType', label: 'Тип обложки', type: 'text', placeholder: 'image/video' },
      { key: 'link', label: 'Ссылка на проект', type: 'url', placeholder: 'https://...' },
      { key: 'github', label: 'GitHub', type: 'url', placeholder: 'https://github.com/...' },
      { key: 'date', label: 'Дата проекта', type: 'date' },
      {
        key: 'disabled',
        label: 'Кнопка отключена',
        type: 'select',
        options: [
          { value: 'false', label: 'Нет' },
          { value: 'true', label: 'Да' },
        ],
      },
    ],
  },
  {
    key: 'achievements',
    label: 'Достижения',
    collection: 'achievements',
    icon: 'trophy',
    columns: [
      { key: 'title', label: 'Название', sortable: true, editable: true, minWidth: '200px' },
      { key: 'desc', label: 'Описание', editable: true, minWidth: '220px' },
      {
        key: 'cover',
        label: 'Обложка',
        type: 'image',
        minWidth: '80px',
        render: (val) =>
          val
            ? React.createElement('img', {
                src: `https://andkiv.com/assets/achievements/${val}`,
                alt: '',
                style: { width: 32, height: 32, borderRadius: 6, objectFit: 'cover' },
              })
            : '—',
      },
      { key: 'date', label: 'Дата', sortable: true, type: 'timestamp', minWidth: '120px' },
      { key: 'link', label: 'Ссылка', type: 'url', editable: true, minWidth: '160px' },
      { key: 'badges', label: 'Бейджи', minWidth: '150px' },
    ],
    fields: [
      { key: 'title', label: 'Название', type: 'text', required: true, placeholder: 'Название достижения' },
      { key: 'desc', label: 'Описание', type: 'textarea', required: true, placeholder: 'Описание' },
      { key: 'cover', label: 'Обложка (URL)', type: 'url', placeholder: 'https://...' },
      { key: 'link', label: 'Ссылка', type: 'url', placeholder: 'https://...' },
      { key: 'date', label: 'Дата достижения', type: 'date' },
      { key: 'badges', label: 'Бейджи', type: 'multiselect', asyncOptions: 'badges' },
    ],
  },
  {
    key: 'grants',
    label: 'Стипендии и гранты',
    collection: 'grants',
    icon: 'wallet',
    columns: [
      { key: 'title', label: 'Название', sortable: true, editable: true, minWidth: '200px' },
      { key: 'desc', label: 'Описание', editable: true, minWidth: '200px' },
      { key: 'sum', label: 'Сумма', sortable: true, editable: true, type: 'number', minWidth: '120px' },
      { key: 'icon', label: 'Иконка', editable: true, minWidth: '100px' },
      { key: 'startDate', label: 'Начало', sortable: true, type: 'timestamp', minWidth: '120px' },
      { key: 'endDate', label: 'Конец', sortable: true, type: 'timestamp', minWidth: '120px' },
    ],
    fields: [
      { key: 'title', label: 'Название', type: 'text', required: true, placeholder: 'Название гранта' },
      { key: 'desc', label: 'Описание', type: 'textarea', required: true, placeholder: 'Описание' },
      { key: 'sum', label: 'Сумма (₽)', type: 'number', required: true, placeholder: '0' },
      { key: 'icon', label: 'Иконка', type: 'select', options: [
        { value: 'govScience', label: 'Правительство' },
        { value: 'polytech', label: 'Политех' },
        { value: 'moscow', label: 'Москва' },
      ]},
      { key: 'startDate', label: 'Дата начала', type: 'date', required: true },
      { key: 'endDate', label: 'Дата окончания', type: 'date', required: true },
    ],
  },
  {
    key: 'stack',
    label: 'Стек',
    collection: 'stack',
    icon: 'stack',
    columns: [
      { key: 'title', label: 'Технология', sortable: true, editable: true, minWidth: '200px' },
      { key: 'desc', label: 'Описание', editable: true, minWidth: '300px' },
    ],
    fields: [
      { key: 'title', label: 'Технология', type: 'text', required: true, placeholder: 'Название технологии' },
      { key: 'desc', label: 'Описание', type: 'textarea', placeholder: 'Описание технологии' },
    ],
  },
  {
    key: 'messages',
    label: 'Сообщения',
    collection: 'messages',
    icon: 'mail',
    columns: [
      { key: 'name', label: 'Имя', sortable: true, minWidth: '140px' },
      { key: 'email', label: 'Email', sortable: true, type: 'email', minWidth: '200px' },
      { key: 'message', label: 'Сообщение', minWidth: '300px' },
      { key: 'createdAt', label: 'Дата', sortable: true, type: 'timestamp', minWidth: '130px' },
    ],
    fields: [
      { key: 'name', label: 'Имя', type: 'text', required: true, placeholder: 'Имя отправителя' },
      { key: 'email', label: 'Email', type: 'email', required: true, placeholder: 'email@example.com' },
      { key: 'message', label: 'Сообщение', type: 'textarea', required: true, placeholder: 'Текст сообщения' },
    ],
  },
  {
    key: 'badges',
    label: 'Бейджи',
    collection: 'badges',
    icon: 'badge',
    columns: [
      { key: 'title', label: 'Название', sortable: true, editable: true, minWidth: '200px' },
      { key: 'color', label: 'Цвет', sortable: true, editable: true, minWidth: '120px' },
      { key: 'icon', label: 'Иконка', sortable: true, editable: true, minWidth: '120px' },
    ],
    fields: [
      { key: 'title', label: 'Название', type: 'text', required: true, placeholder: 'Название бейджа' },
      { key: 'color', label: 'Цвет', type: 'select', required: true, options: [
        { value: 'purple', label: 'Фиолетовый' },
        { value: 'green', label: 'Зеленый' },
        { value: 'orange', label: 'Оранжевый' },
        { value: 'red', label: 'Красный' },
        { value: 'blue', label: 'Синий' },
        { value: 'yellow', label: 'Жёлтый' },
        { value: 'sky', label: 'Голубой' },
        { value: 'pink', label: 'Розовый' },
      ]},
      { key: 'icon', label: 'Иконка', type: 'select', options: [
        { value: 'medal', label: 'Медаль' },
        { value: 'trophy', label: 'Трофей' },
        { value: 'star', label: 'Звезда' },
        { value: 'flame', label: 'Огонь' },
        { value: 'lightning', label: 'Молния' },
        { value: 'diamond', label: 'Алмаз' },
        { value: 'heart', label: 'Сердце' },
        { value: 'crown', label: 'Корона' },
      ]},
    ],
  },
];
