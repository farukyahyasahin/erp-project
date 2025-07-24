import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import './StockManagement.css';

const StockManagement = () => {
  const [categories, setCategories] = useState([]);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    image_url: '',
    category_id: ''
  });
  const [categoryName, setCategoryName] = useState('');
  const [categoryImage, setCategoryImage] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const { data, error } = await supabase.from('categories').select('*');
    if (!error) setCategories(data);
  };

  const handleProductChange = (e) => {
    setProductForm({ ...productForm, [e.target.name]: e.target.value });
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('categories').insert({
      name: categoryName,
      image_url: categoryImage
    });
    if (error) {
      alert('Kategori eklenemedi: ' + error.message);
    } else {
      alert('Kategori eklendi');
      setCategoryName('');
      setCategoryImage('');
      fetchCategories();
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('products').insert({
      ...productForm,
      price: parseFloat(productForm.price),
      stock: parseInt(productForm.stock)
    });
    if (error) {
      alert('Ürün eklenemedi: ' + error.message);
    } else {
      alert('Ürün eklendi');
      setProductForm({ name: '', description: '', price: '', stock: '', image_url: '', category_id: '' });
    }
  };

  return (
    <div className="stock-management">
      <h2>Ürün Ekle</h2>
      <form onSubmit={handleProductSubmit}>
        <input name="name" placeholder="Ürün Adı" value={productForm.name} onChange={handleProductChange} required />
        <input name="description" placeholder="Açıklama" value={productForm.description} onChange={handleProductChange} />
        <input name="price" type="number" placeholder="Fiyat" value={productForm.price} onChange={handleProductChange} required />
        <input name="stock" type="number" placeholder="Stok" value={productForm.stock} onChange={handleProductChange} />
        <input name="image_url" placeholder="Görsel URL" value={productForm.image_url} onChange={handleProductChange} />

        <select name="category_id" value={productForm.category_id} onChange={handleProductChange} required>
          <option value="">Kategori Seç</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>

        <button type="submit" className="btn-green">Ürün Ekle</button>
      </form>

      <h2>Kategori Ekle</h2>
      <form onSubmit={handleCategorySubmit}>
        <input
          type="text"
          placeholder="Kategori Adı"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Görsel URL"
          value={categoryImage}
          onChange={(e) => setCategoryImage(e.target.value)}
        />
        <button type="submit" className="btn-blue">Kategori Ekle</button>
      </form>
    </div>
  );
};

export default StockManagement;
