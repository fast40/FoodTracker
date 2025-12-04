import { createRoot } from 'react-dom/client'
import './global.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from '@/App'
import { AuthProvider } from '@/context/AuthContext';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>
)
