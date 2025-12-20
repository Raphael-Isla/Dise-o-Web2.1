// src/App.tsx - VERSIÓN CORREGIDA
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard/Dashboard';
import Wallet from './pages/Wallet/Wallet';
import Transactions from './pages/Transactions/Transactions';
import Markets from './pages/Markets/Markets';
import Settings from './pages/Settings/Settings';
import Header from './components/Layout/Header/Header';
import Sidebar from './components/Layout/Sidebar/Sidebar';
// Elimina esta línea si globals.css no es necesario:
// import './styles/globals.css';

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/wallet" element={<Wallet />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/markets" element={<Markets />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default App;