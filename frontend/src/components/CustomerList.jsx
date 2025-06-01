import React, { useEffect, useState} from 'react'
import { supabase } from '../supabaseClient'

const CustomerList = () => {
    const [customers,setCustomers] = useState([]);

    useEffect(() => {
        const fetchCustomers = async () => {
            const { data,error } = await supabase
            .from('users')
            .select('id, full_name, email')
            .eq('role','user')
            .order('full_name',{ascending: true});

            if(error){
                console.error('Müşteri Çekme Hatası:', error.message);
                return;
            }
            setCustomers(data);
        };
        fetchCustomers();
    },[]);
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
            {customers.map((c) => (
              <tr key={c.id}>
                <td style={{ padding: '8px' }}>{c.full_name}</td>
                <td style={{ padding: '8px' }}>{c.email}</td>
                <td style={{ padding: '8px' }}>{c.id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CustomerList;
