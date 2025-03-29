import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import TopNav from './modules/TopNav.tsx'
import Content from './modules/Content.tsx';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <TopNav />
    <Content/>
  </React.StrictMode>
);
