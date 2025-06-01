import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/products')
    .then((res) => setProducts(res.data))
    .catch((err) => console.error('Hata:' ,err));
  },[]);

    return (
    <div>
        <h2>Ürün Listesi</h2>
        <ul>
            {products.map((p) => (
                <li key={p.id}>
                    <strong>{p.name}</strong> - {p.price} ₺ ({p.stock} adet)
                </li>
            ))}
        </ul>
    </div>
  );
};

export default ProductList;
