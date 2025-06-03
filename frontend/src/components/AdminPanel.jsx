import React, { useState, useEffect } from 'react';
import './AdminPanel.css';
import ProductList from './ProductList';
import ProductForm from './ProductForm';
import CustomerList from './CustomerList';
import CompanyInfo from './CompanyInfo';
import OrderManagement from './OrderManagement';

const AdminPanel = ({ onLogout }) => {
  const [currentView, setCurrentView] = useState(() => {
    return localStorage.getItem('adminView') || 'stok';
  });

  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleString('tr-TR'));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    localStorage.setItem('adminView', currentView);
  }, [currentView]);

  const renderView = () => {
    switch (currentView) {
      case 'siparisler':
        return <OrderManagement />;
      case 'stok':
        return <ProductList />;
      case 'urun':
        return <ProductForm />;
      case 'firma':
        return <CompanyInfo />;
      case 'musteriler':
        return <CustomerList />;
      default:
        return <div>Panel</div>;
    }
  };

  return (
    <div className="admin-panel">
      <header className="admin-header">
        <span>👋 Hoş geldin admin</span>
        <div className="header-right">
          <span>{currentTime}</span>
          <button onClick={onLogout} className="logout-button">Çıkış Yap</button>
        </div>
      </header>

      <div className="admin-body">
        <aside className="admin-sidebar">
          <button onClick={() => setCurrentView('siparisler')}>📦 Siparişler</button>
          <button onClick={() => setCurrentView('stok')}>📊 Stok</button>
          <button onClick={() => setCurrentView('urun')}>➕ Ürün Ekle</button>
          <button onClick={() => setCurrentView('firma')}>🏢 Firma</button>
          <button onClick={() => setCurrentView('musteriler')}>👥 Müşteriler</button>
        </aside>

        <main className="admin-content">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;
