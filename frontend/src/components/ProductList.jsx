import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import './ProductList.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({});
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ minPrice: '', maxPrice: '', minStock: '', maxStock: '' });
  const [sortBy, setSortBy] = useState(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

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

    if (error) {
      console.error(error.message);
      alert('Üürn güncellenirken sorun oluştu!');
      return;
    }

    alert('Ürün başarıyla güncellendi');
    setEditingId(null);
    setForm({});
    fetchProducts();
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortBy(field);
      setSortAsc(true);
    }
  };


  const filteredProducts = products
    .filter(p =>
      (!search || p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase())) &&
      (!filters.minPrice || p.price >= parseFloat(filters.minPrice)) &&
      (!filters.maxPrice || p.price <= parseFloat(filters.maxPrice)) &&
      (!filters.minStock || p.stock >= parseFloat(filters.minStock)) &&
      (!filters.maxStock || p.stock <= parseFloat(filters.maxStock))
    )
    .sort((a, b) => {
      if (!sortBy) return 0;
      const dir = sortAsc ? 1 : -1;
      if (a[sortBy] < b[sortBy]) return -1 * dir;
      if (a[sortBy] > b[sortBy]) return 1 * dir;
      return 0;
    })

  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  return (
    <div>
      <h2>Ürün Listesi</h2>
      <div className="filter-bar">
        <input
          type="text"
          placeholder="Ara (ad veya açıklama)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ marginRight: '10px' }}
        />

        <input
          type="number"
          placeholder="Min Fiyat"
          value={filters.minPrice}
          onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
          style={{ marginRight: '10px' }}
        />
        <input
          type="number"
          placeholder="Max Fiyat"
          value={filters.maxPrice}
          onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
          style={{ marginRight: '10px' }}
        />

        <input
          type="number"
          placeholder="Min Stok"
          value={filters.minStock}
          onChange={(e) => setFilters({ ...filters, minStock: e.target.value })}
          style={{ marginRight: '10px' }}
        />
        <input
          type="number"
          placeholder="Max Stok"
          value={filters.maxStock}
          onChange={(e) => setFilters({ ...filters, maxStock: e.target.value })}
        />
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f1f1f1' }}>
            <th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>Ad</th>
            <th onClick={() => handleSort('description')} style={{ cursor: 'pointer' }}>Açıklama</th>
            <th onClick={() => handleSort('price')} style={{ cursor: 'pointer' }}>Fiyat</th>
            <th onClick={() => handleSort('stock')} style={{ cursor: 'pointer' }}>Stok</th>
            <th>İşlem</th>
          </tr>
        </thead>
        <tbody>
          {currentProducts.map((p) => (
            <tr key={p.id} style={{ borderBottom: '1px solid #ddd' }}>
              {editingId === p.id ? (
                <>
                  <td><input name="name" value={form.name} onChange={handleChange} /></td>
                  <td><input name="description" value={form.description} onChange={handleChange} /></td>
                  <td><input name="price" value={form.price} onChange={handleChange} /></td>
                  <td><input name="stock" value={form.stock} onChange={handleChange} /></td>
                  <td>
                    <button onClick={handleUpdate} className="save-btn" style={{ color: 'white' }}>Kaydet</button>
                    <button onClick={handleCancel} className="cancel-btn" style={{ color: 'white' }}>İptal</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{p.name}</td>
                  <td>{p.description}</td>
                  <td>{p.price} ₺</td>
                  <td>{p.stock}</td>
                  <td>
                    <button onClick={() => handleEdit(p)} style={{ color: 'white' }}>Düzenle</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      <div>
            <label>Sayfa başına kayıt: </label>
            <input type="number" 
            min={1}
            value={itemsPerPage}
            onChange={(e) => {
              const value = Number(e.target.value);
              if(value => 1) {
                setItemsPerPage(value);
                setCurrentPage(1);
              }
            }}
            style={{width: '60px', padding: '4px', marginLeft: '6px'}}
            />
          </div>

          {/* Sayfa kontrol butonları */}
          <div className="pagination-controls">
            <button 
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Önceki
            </button>

            <span style={{ margin: '0 10px' }}>
              Sayfa {currentPage} / {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Sonraki
            </button>
          </div>

    </div>
  );
};

export default ProductList;
