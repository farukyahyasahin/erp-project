import React from 'react';
import ProductList from './ProductList';
import './UserPanel.css'; // Varsa stil dosyanı da ekle

const UserPanel = ({ onLogout }) => {
  return (
    <div style={{ padding: '20px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h2>Kullanıcı Paneli</h2>
        <button onClick={onLogout} className="logout-button">Çıkış Yap</button>
      </div>
      <ProductList />
    </div>
  );
};

export default UserPanel;
