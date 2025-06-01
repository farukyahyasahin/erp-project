import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import './Auth.css';


const Signup = ({ onSignup, switchToLogin }) => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignup = async (e) => {
        e.preventDefault();

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { full_name: fullName }
            }
        });

        if (error) return alert(error.message);
        alert('Kayıt başarılı ✅');

        if (data.user) {
            await supabase.from('users').insert([{
                id: data.user.id,
                email: email,
                full_name: fullName,
                role: role
            }]);

            onSignup(data.user);
        }
    };

    return (
        <form onSubmit={handleSignup}>
            <h2>Kayıt Ol</h2>
            <input type="text" placeholder="Ad Soyad" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
            <input type="email" placeholder="E-posta" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input type="password" placeholder="Şifre" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button type="submit">Kayıt Ol</button>
            <p className="login-toggle" onClick={switchToLogin}>
                Zaten hesabın var mı? Giriş yap
            </p>
        </form>
    );
};

export default Signup;
