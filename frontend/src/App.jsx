import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import Login from './components/Login';
import Signup from './components/Signup';
import ProductList from './components/ProductList';
import ProductForm from './components/ProductForm';

const App = () => {
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const triggerRefresh = () => setRefresh(!refresh);

  return (
    <div style={{ padding: '20px' }}>
      <h1>ERP</h1>

      {!user ? (
        authMode === 'login' ? (
          <Login onLogin={setUser} switchToSignup={() => setAuthMode('signup')} />
        ) : (
          <Signup onSignup={setUser} switchToLogin={() => setAuthMode('login')} />
        )
      ) : (
        <>
          <p>
            👋 Hoş geldin, {user.email}
            <button onClick={handleLogout} className="logout-button">
              Çıkış Yap
            </button>
          </p>
          <ProductForm onAdded={triggerRefresh} />
          <hr />
          <ProductList key={refresh} />
        </>
      )}
    </div>
  );
};

export default App;
