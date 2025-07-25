import React from 'react';
import { supabase } from '../supabaseClient';
import './Cart.css';

const Cart = ({ cartItems, setCartItems, userId }) => {
  const handleRemove = (productId) => {
    setCartItems(cartItems.filter(item => item.product.id !== productId));
  };

  const getTotal = () => {
    const total = cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
    return total.toFixed(2); // Kesirli basamak sorunu çözülür
  };

  const handleOrder = async () => {
    if (!userId) {
      alert("Kullanıcı bilgisi eksik.");
      return;
    }

    const items = cartItems.map(item => ({
      product_id: item.product.id,
      quantity: item.quantity,
      unit_price: item.product.price,
    }));

    const { error } = await supabase
      .from('orders')
      .insert([{ user_id: userId, total: parseFloat(getTotal()) }])
      .select('id')
      .single();

    if (error) return alert("Sipariş oluşturulamadı: " + error.message);

    const { data: lastOrder } = await supabase
      .from('orders')
      .select('id')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    const orderItems = items.map(i => ({
      ...i,
      order_id: lastOrder.id
    }));

    const { error: itemErr } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemErr) return alert("Sipariş detayları kaydedilemedi: " + itemErr.message);

    alert("Sipariş başarıyla oluşturuldu.");
    setCartItems([]); // Sepeti boşalt
  };

  return (
    <div className="cart">
      <h2>Sepet</h2>
      {cartItems.length === 0 ? (
        <p>Sepetiniz boş</p>
      ) : (
        <>
          <ul>
            {cartItems.map(({ product, quantity }) => (
              <li key={product.id}>
                <span>{product.name} x {quantity} – {(product.price * quantity).toFixed(2)} TL</span>
                <button onClick={() => handleRemove(product.id)}>Sil</button>
              </li>
            ))}
          </ul>
          <p><strong>Toplam:</strong> {getTotal()} TL</p>
          <button className="order-button" onClick={handleOrder}>Siparişi Ver</button>
        </>
      )}
    </div>
  );
};

export default Cart;
