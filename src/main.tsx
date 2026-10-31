import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';

import '@mantine/core/styles.css';
import './shared/styles/_fonts.scss';
import './app/styles/globals.scss';

import { App } from './app/App';
import { StoreProvider } from 'shared/stores/StoreContext';
import { NotificationProvider } from 'shared/ui/Notifications';
import DesignUpdateAnnouncement from 'features/announcements';
import { FONT_FAMILY } from 'shared/styles/fonts';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <MantineProvider
        theme={{
          primaryColor: 'gray',
          fontFamily: FONT_FAMILY.sans,
          headings: { fontFamily: FONT_FAMILY.sans },
          fontFamilyMonospace: FONT_FAMILY.mono,
        }}
      >
        <StoreProvider>
          <NotificationProvider>
            <App />
            <DesignUpdateAnnouncement />
          </NotificationProvider>
        </StoreProvider>
      </MantineProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
