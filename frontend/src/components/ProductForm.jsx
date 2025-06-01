import React, { useState } from 'react';
import axios from 'axios';


const ProductForm = ({ onAdded }) => {

    const [form, setForm] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/products', {
                ...form,
                price: parseFloat(form.price),
                stock: parseInt(form.stock),
            });
            alert('Ürün Eklendi');
            setForm({ name: '', description: '', price: '', stock: '' });
            onAdded?.();
        } catch (err) {
            alert('Ekleme Başarısız');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Ürün Ekle</h2>
            <input name='name' placeholder='Ad' value={form.name} onChange={handleChange} required />
            <input name='description' placeholder='Açıklama' value={form.description} onChange={handleChange} />
            <input name='price' placeholder='Fiyat' value={form.price} onChange={handleChange} required />
            <input name='stock' placeholder='Stok' value={form.stock} onChange={handleChange} />
            <button type='submit'>Kaydet</button>
        </form>
    );
};

export default ProductForm;
