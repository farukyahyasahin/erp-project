import React, {useEffect,useState} from 'react';
import { supabase } from '../supabaseClient';


const ProductListUser = ({onAddToCart}) => {
    const [products,setProducts] = useState([]);

    useEffect(() => {
        fetchProducts();
    },[]);

    const fetchProducts = async () => {
        const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at',{ascending: false}); 

        if(!error) setProducts(data);
    };
    
  return (
    <div className="user-products">
      <h2>Ürünler</h2>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            <div>
              <strong>{product.name}</strong> – {product.description}<br />
              Fiyat: {product.price} TL – Stok: {product.stock}
            </div>
            <div>
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
    </div>
  );
};

export default ProductListUser;
