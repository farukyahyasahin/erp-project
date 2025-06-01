import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({});

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) return console.error(error.message);
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEdit = (product) => {
    setEditingId(product.id);
    setForm({ ...product });
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm({});
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    const { error } = await supabase
      .from('products')
      .update({
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        stock: parseInt(form.stock)
      })
      .eq('id', editingId);

    setEditingId(null);
    setForm({});
    fetchProducts();
  };

  return (
    <div>
      <h2>Ürün Listesi</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f1f1f1' }}>
            <th>Ad</th>
            <th>Açıklama</th>
            <th>Fiyat</th>
            <th>Stok</th>
            <th>İşlem</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} style={{ borderBottom: '1px solid #ddd' }}>
              {editingId === p.id ? (
                <>
                  <td><input name="name" value={form.name} onChange={handleChange} /></td>
                  <td><input name="description" value={form.description} onChange={handleChange} /></td>
                  <td><input name="price" value={form.price} onChange={handleChange} /></td>
                  <td><input name="stock" value={form.stock} onChange={handleChange} /></td>
                  <td>
                    <button onClick={handleUpdate}>Kaydet</button>
                    <button onClick={handleCancel}>İptal</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{p.name}</td>
                  <td>{p.description}</td>
                  <td>{p.price} ₺</td>
                  <td>{p.stock}</td>
                  <td>
                    <button onClick={() => handleEdit(p)}>Düzenle</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;
