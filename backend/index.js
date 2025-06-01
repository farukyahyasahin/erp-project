const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const supabase = require('./supabaseClient');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ✅ TEST ENDPOINT
app.get('/', (req, res) => {
  res.send('ERP Backend çalışıyor ✅');
});

// ✅ PRODUCTS ENDPOINT
app.get('/api/products', async (req, res) => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});


app.post('/api/products', async (req, res) => {
  const { name, description, price, stock } = req.body;

  // Girdi kontrolü
  if (!name || !price) {
    return res.status(400).json({ error: 'Ürün adı ve fiyat zorunludur.' });
  }

  const { data, error } = await supabase
    .from('products')
    .insert([{ name, description, price, stock }])
    .select();

  if (error) {
    console.error('Ekleme hatası:', error.message);
    return res.status(500).json({ error: error.message });
  }

  res.status(201).json(data[0]); // Yeni eklenen ürünü döndür
});

app.listen(PORT, () => {
  console.log(`✅ Backend ${PORT} portunda çalışıyor`);
});

