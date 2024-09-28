import React from 'react';
import {
  BrowserRouter as Router,
} from "react-router-dom";
import { UserProvider } from './UserContext';
import UserRouter from './UserRouter';
import { ToastProvider } from './ToastContext';
import { APIStatusProvider } from './ApiStatusContext';



function App() {

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
