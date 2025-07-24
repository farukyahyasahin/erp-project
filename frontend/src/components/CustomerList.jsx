import React, { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  useEffect(() => {
    const fetchCustomers = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('id, full_name, email')
        .eq('role', 'user')
        .order('full_name', { ascending: true });

      if (error) {
        console.error('Müşteri Çekme Hatası:', error.message);
        return;
      }
      setCustomers(data);
    };
    fetchCustomers();
  }, []);

  const indexOfLastCustomer = currentPage * itemsPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - itemsPerPage;
  const currentCustomers = customers.slice(indexOfFirstCustomer, indexOfLastCustomer);
  const totalPages = Math.ceil(customers.length / itemsPerPage);

  return (
    <div>
      <h2>Müşteri Listesi</h2>
      {customers.length === 0 ? (
        <p>Henüz müşteri yok.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ borderBottom: '1px solid #ccc', padding: '8px' }}>Ad Soyad</th>
              <th style={{ borderBottom: '1px solid #ccc', padding: '8px' }}>E-posta</th>
              <th style={{ borderBottom: '1px solid #ccc', padding: '8px' }}>Kullanıcı ID</th>
            </tr>
          </thead>
          <tbody>
            {currentCustomers.map((c) => (
              <tr key={c.id}>
                <td style={{ padding: '8px' }}>{c.full_name}</td>
                <td style={{ padding: '8px' }}>{c.email}</td>
                <td style={{ padding: '8px' }}>{c.id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div>
        <label>Sayfa başına kayıt: </label>
        <input type="number"
          min={1}
          value={itemsPerPage}
          onChange={(e) => {
            const value = Number(e.target.value);
            if (value => 1) {
              setItemsPerPage(value);
              setCurrentPage(1);
            }
          }}
          style={{ width: '60px', padding: '4px', marginLeft: '6px' }}
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

export default CustomerList;
