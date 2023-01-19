import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import store from './store/store';
import Theme from './themes/Theme';

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <Theme>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <link
              href="https://fonts.googleapis.com/css?family=Poppins"
              rel="stylesheet"
            />
            <App />
          </BrowserRouter>
        </QueryClientProvider>
      </Theme>
    </Provider>
  </React.StrictMode>
);
