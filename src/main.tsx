import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { initCustomCursor } from './lib/initCustomCursor';
import App from './App';
import { ThemeProvider } from './context/ThemeContext';

initCustomCursor();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>
);
