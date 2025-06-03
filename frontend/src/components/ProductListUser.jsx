import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import '../App.css';


const ProductListUser = ({ onAddToCart }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error) setProducts(data);
  };

  return (
    <ul className="user-products">
      {products.map((product) => (
        <li key={product.id}>
          <div className="product-info">
            <strong>{product.name}</strong> – {product.description}<br />
            Fiyat: {product.price} TL – Stok: {product.stock}
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
        </li>
      ))}
    </ul>
  );
};

export default ProductListUser;
