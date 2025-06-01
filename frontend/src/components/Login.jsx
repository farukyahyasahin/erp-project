import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import './Auth.css';

const Login = ({ onLogin, switchToSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (data.session) onLogin(data.session.user);
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>Giriş Yap</h2>
      <input type="email" placeholder="E-posta" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input type="password" placeholder="Şifre" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <button type="submit">Giriş Yap</button>
      <p className="login-toggle" onClick={switchToSignup}>
        Hesabın yok mu? Kayıt ol
      </p>
    </form>
  );
};

export default Login;
