import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// Self-hosted fonts (work offline). Hangul body font + handwritten heading font.
import '@fontsource-variable/noto-sans-kr';
import '@fontsource/gaegu/400.css';
import '@fontsource/gaegu/700.css';

import './styles/index.css';
import App from './App';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Could not find the #root element in index.html.');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
