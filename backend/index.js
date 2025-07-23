const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const supabase = require('./supabaseClient');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: 'http://localhost:3000'
}));
app.use(express.json());


app.get('/', (req, res) => {
  res.send('ERP Backend çalışıyor ✅');
});


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

  res.status(201).json(data[0]);
});

app.post('/api/orders', async (req,res) => {
  const {user_id, items} = req.body;

  if(!user_id || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({error: 'Geçersiz sipraiş verisi'});
  }

  let total = 0;
  for(const item of items) {
    total += item.unit_price * item.quantity;
  }

  const { data: order, error: orderError } = await supabase
  .from('orders')
  .insert([{ user_id,total }])
  .select()
  .single();

  if(orderError) return res.status(500).json({error : orderError.message});

  const orderItems = items.map(item => ({
    order_id: order.id,
    product_id: item.product_id,
    quantity: item.quantity,
    unit_price: item.unit_price,
  }));

  const { error: itemsError } = await supabase
  .from('order_items')
  .insert(orderItems);

  if(itemsError) return res.status(500).json({ error: itemsError.message });

res.status(201).json({ message: 'Sipariş başarıyla oluşturuldu.' });
});

app.get('/api/orders', async (req, res) => {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      id,
      user_id,
      total,
      created_at,
      users ( full_name, email ),
      order_items (
        quantity,
        unit_price,
        products ( name )
      )
    `)
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.patch('/api/orders/:id/onay', async (req, res) => {
  const orderId = req.params.id;

  // Sipariş ürünlerini al
  const { data: orderItems, error: fetchError } = await supabase
    .from('order_items')
    .select('product_id, quantity')
    .eq('order_id', orderId);

  if (fetchError) return res.status(500).json({ error: fetchError.message });

  // Her ürün için stoğu düşür
  for (const item of orderItems) {
    await supabase.rpc('decrease_stock', {
      p_product_id: item.product_id,
      p_quantity: item.quantity
    });
  }

  // Siparişi onayla
  const { error: updateError } = await supabase
    .from('orders')
    .update({ status: 'onaylandı' })
    .eq('id', orderId);

  if (updateError) return res.status(500).json({ error: updateError.message });

  res.json({ message: 'Sipariş onaylandı ve stok düşürüldü.' });
});

app.patch('/api/orders/:id/red', async (req, res) => {
  const { error } = await supabase
    .from('orders')
    .update({ status: 'reddedildi' })
    .eq('id', req.params.id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: 'Sipariş reddedildi.' });
});


app.listen(PORT, () => {
  console.log(`✅ Backend ${PORT} portunda çalışıyor`);
});

