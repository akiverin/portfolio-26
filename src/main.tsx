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

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <MantineProvider>
        <StoreProvider>
          <NotificationProvider>
            <App />
          </NotificationProvider>
        </StoreProvider>
      </MantineProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
