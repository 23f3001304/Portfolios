import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './styles.css';

/* Hidden hello for the curious */
if (typeof window !== 'undefined' && !window.__signed) {
  window.__signed = true;
  const big   = 'color: #ff5e00; font: 600 14px/1.2 -apple-system, Inter, sans-serif; letter-spacing: -0.02em';
  const small = 'color: #888; font: 11px/1.4 ui-monospace, "SF Mono", Menlo, monospace';
  // eslint-disable-next-line no-console
  console.log(
    '%cHemang Choudhary\n%cBackend systems, ML pipelines, weird side-projects.\nGitHub: github.com/coehemang\nMail:   hemangc37@gmail.com',
    big, small
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
