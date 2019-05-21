import React from 'react';
import './App.css';
import MainPage from './common/MainPage';
import { initializeIcons } from '@uifabric/icons';

const App: React.FC = () => {
  initializeIcons();

  return (
    <MainPage />
  );
}

export default App;
