import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import './ProductListUser.css';

const ProductListUser = ({ onAddToCart }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [products, setProducts] = useState([]);

  // Kategorileri çek
  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true });

      if (!error) setCategories(data);
    };

    fetchCategories();
  }, []);

  // Seçilen kategoriye göre ürünleri çek
  useEffect(() => {
    if (!selectedCategory) return;

    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, description, price, stock, image_url')
        .eq('category_id', selectedCategory.id)
        .order('created_at', { ascending: false });

      if (!error) setProducts(data);
    };

    fetchProducts();
  }, [selectedCategory]);

  return (
    <div className="product-page">
      {/* KATEGORİLER */}
      <div className="category-list">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className={`category-card ${selectedCategory?.id === cat.id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat)}
          >
            <img src={cat.image_url} alt={cat.name} />
            <span>{cat.name}</span>
          </div>
        ))}
      </div>

      {/* ÜRÜNLER */}
      <div className="products-container">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <img
              src={product.image_url}
              alt={product.name}
              className="product-image"
            />
            <div className="product-info">
              <strong>{product.name}</strong>
              <p>{product.description}</p>
              <span>{product.price} TL</span><br />
              <small>Stok: {product.stock}</small>
            </div>
            <div className="product-actions">
              <input
                type="number"
                min="1"
                max={product.stock}
                defaultValue={1}
                onChange={(e) => product.selectedQuantity = parseInt(e.target.value)}
              />
              <button onClick={() => onAddToCart(product, product.selectedQuantity || 1)}>
                Sepete Ekle
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductListUser;
