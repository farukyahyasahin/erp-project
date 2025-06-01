import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const CompanyInfo = () => {
  const [company, setCompany] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ name: '', address: '', phone: '', tax_number: '' });
  const [companyId, setCompanyId] = useState(null);

  useEffect(() => {
    const fetchCompany = async () => {
      const { data, error } = await supabase
        .from('company_info')
        .select('*')
        .limit(1)
        .single();

      if (error) return console.error('Firma bilgisi alınamadı:', error.message);

      setCompany(data);
      setForm(data);
      setCompanyId(data.id); // UUID sakla
    };

    fetchCompany();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const { error } = await supabase
      .from('company_info')
      .update(form)
      .eq('id', companyId);

    setCompany(form);
    setIsEditing(false);
  };

  if (!company) return <p>Yükleniyor...</p>;

  return (
    <div>
      <h2>Firma Bilgileri</h2>
      {isEditing ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px' }}>
          <input name="name" value={form.name} onChange={handleChange} placeholder="Firma Adı" />
          <input name="address" value={form.address} onChange={handleChange} placeholder="Adres" />
          <input name="phone" value={form.phone} onChange={handleChange} placeholder="Telefon" />
          <input name="tax_number" value={form.tax_number} onChange={handleChange} placeholder="Vergi Numarası" />
          <button onClick={handleSave}>Kaydet</button>
        </div>
      ) : (
        <div style={{ lineHeight: '1.8' }}>
          <p><strong>Firma Adı:</strong> {company.name}</p>
          <p><strong>Adres:</strong> {company.address}</p>
          <p><strong>Telefon:</strong> {company.phone}</p>
          <p><strong>Vergi No:</strong> {company.tax_number}</p>
          <button onClick={() => setIsEditing(true)}>Düzenle</button>
        </div>
      )}
    </div>
  );
};

export default CompanyInfo;
