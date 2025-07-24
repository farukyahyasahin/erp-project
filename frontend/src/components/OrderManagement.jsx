import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import './OrderManagement.css';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

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

  const indexOfLastOrder = currentPage * itemsPerPage;
  const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(orders.length / itemsPerPage);

  return (
    <div className="order-management">
      <h2>Siparişler</h2>
      {orders.length === 0 ? (
        <p>Henüz sipariş yok.</p>
      ) : (
        <>
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
              {currentOrders.map(order => (
                <tr key={order.id}>
                  <td>
                    {order.users?.full_name} <br />
                    <small>{order.users?.email}</small>
                  </td>
                  <td className="product-cell">
                    <div className="product-preview">
                      {order.order_items.length} ürün
                    </div>
                    <ul className="product-list">
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
                    {order.status === 'onaylandı' || order.status === 'reddedildi' ? (
                      '-'
                    ) : (
                      <>
                        <button onClick={() => handleAction(order.id, 'onay')}>
                          Onayla
                        </button>
                        <button onClick={() => handleAction(order.id, 'red')}>
                          Reddet
                        </button>
                      </>
                    )}
                  </td>
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
        </>
      )}
    </div>
  );
};

export default OrderManagement;
