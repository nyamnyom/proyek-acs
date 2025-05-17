import React, { useEffect, useState } from 'react';
import {
  Box, Toolbar, Typography, Button, Alert, Autocomplete, TextField, Table, TableBody, TableCell, TableHead, TableRow
} from '@mui/material';
import Swal from 'sweetalert2';
import NavbarPengiriman from './NavbarPengiriman';

export default function KirimOrder() {
  const [ordersAvailable, setOrdersAvailable] = useState([]); // order yg bisa dipilih (belum terkirim)
  const [selectedOrder, setSelectedOrder] = useState(null);  // order yg dipilih di dropdown
  const [ordersToSend, setOrdersToSend] = useState([]);      // list order yg akan dikirim (keranjang)
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Load orders yg belum terkirim untuk pilihan
  useEffect(() => {
    async function fetchOrders() {
      try {
        const data = await window.api.getPendingOrders();
        setOrdersAvailable(data);
      } catch (err) {
        setError('Gagal memuat daftar order');
      }
    }
    fetchOrders();
  }, []);

  // Tambah order yg dipilih ke keranjang kirim
  const handleTambahOrder = () => {
    setError('');
    if (!selectedOrder) {
      setError('Silakan pilih order terlebih dahulu');
      return;
    }
    // Cek apakah sudah ada di keranjang
    if (ordersToSend.find(o => o.id === selectedOrder.id)) {
      setError('Order sudah ada di daftar kirim');
      return;
    }
    setOrdersToSend([...ordersToSend, selectedOrder]);
    setSelectedOrder(null);
  };

  // Hapus order dari keranjang kirim
  const handleHapusOrder = (id) => {
    setOrdersToSend(ordersToSend.filter(o => o.id !== id));
  };

  // Kirim semua order yang ada di keranjang kirim
  const handleKirim = async () => {
    setError('');
    if (ordersToSend.length === 0) {
      setError('Belum ada order yang dipilih untuk dikirim');
      return;
    }
    setLoading(true);
    try {
      for (const order of ordersToSend) {
        const result = await window.api.updateOrderStatus(order.id, 'terkirim');
        if (!result.success) {
          Swal.fire('Gagal', `Gagal mengirim order dengan ID ${order.id}`, 'error');
          setLoading(false);
          return;
        }
      }
      Swal.fire('Berhasil', 'Semua order berhasil dikirim', 'success');
      // Setelah kirim, update list order tersedia dan keranjang kirim
      setOrdersAvailable(prev => prev.filter(o => !ordersToSend.find(s => s.id === o.id)));
      setOrdersToSend([]);
    } catch (err) {
      Swal.fire('Error', 'Terjadi kesalahan saat mengirim order', 'error');
    }
    setLoading(false);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <NavbarPengiriman />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Typography variant="h4" gutterBottom>Pengiriman Order</Typography>

        {error && <Alert severity="warning" sx={{ mb: 2 }}>{error}</Alert>}

        <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center' }}>
          <Autocomplete
            sx={{ width: 400 }}
            options={ordersAvailable}
            getOptionLabel={(option) => `#${option.id} - ${option.nama_pembeli} - ${option.harga_total.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}`}
            value={selectedOrder}
            onChange={(e, newValue) => setSelectedOrder(newValue)}
            renderInput={(params) => <TextField {...params} label="Pilih Order untuk Dikirim" />}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            clearOnEscape
          />
          <Button variant="contained" onClick={handleTambahOrder}>Tambah ke Kirim</Button>
        </Box>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID Order</TableCell>
              <TableCell>Nama Pembeli</TableCell>
              <TableCell>Total Harga</TableCell>
              <TableCell>Aksi</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ordersToSend.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">Belum ada order yang dipilih</TableCell>
              </TableRow>
            ) : (
              ordersToSend.map(order => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{order.nama_pembeli}</TableCell>
                  <TableCell>{order.harga_total.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</TableCell>
                  <TableCell>
                    <Button color="error" onClick={() => handleHapusOrder(order.id)}>Hapus</Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 3 }}
          onClick={handleKirim}
          disabled={ordersToSend.length === 0 || loading}
        >
          {loading ? 'Mengirim...' : 'Kirim Semua Order'}
        </Button>
      </Box>
    </Box>
  );
}
