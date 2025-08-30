import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import RootRouter from './RootRouter';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RootRouter />
  </React.StrictMode>,
);
