import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import ProductListUser from './ProductListUser';
import Cart from './Cart';
import './UserPanel.css';

const UserPanel = ({ onLogout }) => {
  const [userId, setUserId] = useState(null);
  const [currentView, setCurrentView] = useState('products');
  const [cartItems, setCartItems] = useState([]);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUserId(user.id);
    };
    fetchUser();

    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleString('tr-TR'));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleAddToCart = (product, quantity) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const renderView = () => {
    switch (currentView) {
      case 'products':
        return <ProductListUser onAddToCart={handleAddToCart} />;
      case 'cart':
        return <Cart cartItems={cartItems} setCartItems={setCartItems} userId={userId} />;
      default:
        return <p>Panel</p>;
    }
  };

  return (
    <div className="admin-panel">
      <header className="admin-header">
        <span>👋 Hoş geldiniz</span>
        <div className="header-right">
          <span>{currentTime}</span>
          <button onClick={onLogout} className="logout-button">Çıkış Yap</button>
        </div>
      </header>

      <div className="admin-body">
        <aside className="admin-sidebar">
          <button onClick={() => setCurrentView('products')}>🛍️ Ürünler</button>
          <button onClick={() => setCurrentView('cart')}>🛒 Sepetim</button>
        </aside>

        <main className="admin-content">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default UserPanel;
