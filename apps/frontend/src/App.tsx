import React from 'react';
import './App.css';
import { AuthProvider } from './provider/AuthProvider';
import { Pages } from './routes';
import { BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Pages/>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
