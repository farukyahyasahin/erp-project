import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import './OrderManagement.css';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('orders')
      .select(`
        id,
        total,
        created_at,
        status,
        users ( full_name, email ),
        order_items (
          quantity,
          unit_price,
          products ( name )
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Sipariş çekme hatası:', error.message);
    } else {
      setOrders(data);
    }
    setLoading(false);
  };

  const handleAction = async (id, action) => {
    const endpoint = `http://localhost:5000/api/orders/${id}/${action}`;
    try {
      const res = await fetch(endpoint, { method: 'PATCH' });
      const result = await res.json();
      if (res.ok) {
        alert(result.message);
        fetchOrders();
      } else {
        alert(result.error);
      }
    } catch (err) {
      console.error('İşlem hatası:', err.message);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <p>Yükleniyor...</p>;

  return (
    <div className="order-management">
      <h2>Siparişler</h2>
      {orders.length === 0 ? (
        <p>Henüz sipariş yok.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Müşteri</th>
              <th>Ürünler</th>
              <th>Toplam</th>
              <th>Tarih</th>
              <th>Durum</th>
              <th>İşlem</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td>
                  {order.users?.full_name} <br />
                  <small>{order.users?.email}</small>
                </td>
                <td>
                  <ul>
                    {order.order_items.map((item, i) => (
                      <li key={i}>
                        {item.products?.name} × {item.quantity}
                      </li>
                    ))}
                  </ul>
                </td>
                <td>{order.total} ₺</td>
                <td>{new Date(order.created_at).toLocaleString('tr-TR')}</td>
                <td>{order.status || 'beklemede'}</td>
                <td>
                  {order.status === 'approved' || order.status === 'rejected' ? (
                    '-'
                  ) : (
                    <>
                      <button onClick={() => handleAction(order.id, 'approve')}>
                        Onayla
                      </button>
                      <button onClick={() => handleAction(order.id, 'reject')}>
                        Reddet
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OrderManagement;
