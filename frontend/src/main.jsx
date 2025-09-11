import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

console.log('🚀 Frontend iniciando...');
console.log('📍 API URL:', import.meta.env.VITE_API_URL);

const rootElement = document.getElementById('root');
console.log('🎯 Root element:', rootElement);

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
  console.log('✅ React app renderizada!');
} else {
  console.error('❌ Elemento root não encontrado!');
}
