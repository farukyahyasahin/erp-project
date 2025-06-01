import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import Login from './components/Login';
import Signup from './components/Signup';
import AdminPanel from './components/AdminPanel';
import UserPanel from './components/UserPanel';

const App = () => {
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState('login');
  const [role, setRole] = useState(null);

  // Kullanıcının rolünü yükleyen fonksiyon
  const loadRole = async (user) => {
    if (!user) return;
    const { data: userMeta } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (userMeta) setRole(userMeta.role);
  };

  // Giriş sonrası çağrılır
  const handleLogin = async (user) => {
    setUser(user);
    await loadRole(user);
  };

  // Sayfa yenileme sonrası kullanıcı varsa tekrar set et
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        await loadRole(user);
      }
    };
    getUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setRole(null);
  };

  return (
    <div>
      {!user ? (
        authMode === 'login' ? (
          <Login onLogin={handleLogin} switchToSignup={() => setAuthMode('signup')} />
        ) : (
          <Signup onSignup={handleLogin} switchToLogin={() => setAuthMode('login')} />
        )
      ) : (
        <>
          {role === 'admin' && <AdminPanel onLogout={handleLogout} />}
          {role === 'user' && <UserPanel onLogout={handleLogout} />}
        </>
      )}
    </div>
  );
};

export default App;
