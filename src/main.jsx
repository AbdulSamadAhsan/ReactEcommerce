import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';
import './buttons.css';
import { BrowserRouter } from 'react-router-dom';
import { CurrencyProvider } from './CurrencyContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
         <BrowserRouter>
          <CurrencyProvider><App /></CurrencyProvider>
         </BrowserRouter>
   
  </React.StrictMode>,
);
