import React from 'react';
import { createRoot } from 'react-dom/client';
import AgentsUIRoot from './Agents';
import './index.css';
import BaseLayout from './BaseLayout';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/*<AgentsUIRoot />*/}
    <BaseLayout />
  </React.StrictMode>,
);
