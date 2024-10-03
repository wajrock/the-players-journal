import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
} from "react-router-dom";
import { UserProvider } from './UserContext';
import UserRouter from './UserRouter';
import { ToastProvider } from './ToastContext';
import { APIStatusProvider } from './ApiStatusContext';
import packageJson  from '../package.json'

const STORAGE_VERSION_KEY = "app_version";
const CURRENT_APP_VERSION = packageJson.version;

function App() {
  useEffect(()=>{
    const storedVersion = localStorage.getItem(STORAGE_VERSION_KEY);
    if (storedVersion !== CURRENT_APP_VERSION) {
      localStorage.clear();
      localStorage.setItem(STORAGE_VERSION_KEY, CURRENT_APP_VERSION);
    }
  },[])
  return (
    <APIStatusProvider>
      <UserProvider>
            
            <Router>
              <ToastProvider>
              <UserRouter/>
              </ToastProvider>
            </Router>
          
        </UserProvider>
    </APIStatusProvider>
    
  );
}

export default App;
