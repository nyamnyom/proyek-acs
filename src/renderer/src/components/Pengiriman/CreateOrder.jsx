import React, { useEffect, useState } from 'react';
import {
  Box, Toolbar, Typography, TextField, Button,
  Table, TableHead, TableRow, TableCell, TableBody,
  Autocomplete, Alert
} from '@mui/material';
import Swal from 'sweetalert2';
import NavbarPengiriman from './NavbarPengiriman';

export default function CreateOrder() {
  const [barangList, setBarangList] = useState([]);
  const [selectedBarang, setSelectedBarang] = useState(null);
  const [qty, setQty] = useState('');
  const [keranjang, setKeranjang] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [namaPembeli, setNamaPembeli] = useState('');

  useEffect(() => {
    async function fetchBarang() {
      const data = await window.api.getBarang();
      setBarangList(data);
    }
    fetchBarang();
  }, []);

  const handleTambah = () => {
    setError('');
    if (!selectedBarang) {
      setError('Pilih barang terlebih dahulu');
      return;
    }
    const qtyNum = parseInt(qty);
    if (!qtyNum || qtyNum <= 0) {
      setError('Jumlah harus lebih dari 0');
      return;
    }
    if (qtyNum > selectedBarang.stok) {
      setError(`Stok tidak cukup. Stok tersedia: ${selectedBarang.stok}`);
      return;
    }
    const existIndex = keranjang.findIndex(k => k.id === selectedBarang.id);
    if (existIndex >= 0) {
      const newQty = keranjang[existIndex].qty + qtyNum;
      if (newQty > selectedBarang.stok) {
        setError(`Stok tidak cukup jika ditambahkan. Stok tersedia: ${selectedBarang.stok}`);
        return;
      }
      const newKeranjang = [...keranjang];
      newKeranjang[existIndex].qty = newQty;
      setKeranjang(newKeranjang);
    } else {
      setKeranjang([...keranjang, { ...selectedBarang, qty: qtyNum }]);
    }
    setSelectedBarang(null);
    setQty('');
  };

  const totalHarga = keranjang.reduce((acc, cur) => acc + cur.harga * cur.qty, 0);

  const handleHapusItem = (id) => {
    setKeranjang(keranjang.filter(item => item.id !== id));
  };

  const handleSimpanOrder = async () => {
  setError('');
  if (keranjang.length === 0) {
    setError('Keranjang masih kosong');
    return;
  }
  if (!namaPembeli.trim()) {
    setError('Nama pembeli wajib diisi');
    return;
  }

  setLoading(true);
  try {
    const data = await window.api.createOrder({
      namaPembeli,
      keranjang: keranjang.map(({ id, qty }) => ({ id, qty })),
      hargaTotal: totalHarga
    });

    const { orderId } = data.orderId;

    const updatedBarangList = barangList.map(b => {
      const itemKeranjang = keranjang.find(k => k.id === b.id);
      if (itemKeranjang) return { ...b, stok: b.stok - itemKeranjang.qty };
      return b;
    });
    setBarangList(updatedBarangList);
    setKeranjang([]);
    setNamaPembeli('');

    Swal.fire({
      title: 'Order Berhasil!',
      text: `ID Order: ${orderId}`,
      icon: 'success',
      confirmButtonText: 'OK'
    });
  } catch (err) {
    setError(err.message || 'Terjadi kesalahan');
  }
  setLoading(false);
};


  return (
    <Box sx={{ display: 'flex' }}>
      <NavbarPengiriman />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Typography variant="h4" gutterBottom>Create Order</Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <TextField
          label="Nama Pembeli"
          value={namaPembeli}
          onChange={(e) => setNamaPembeli(e.target.value)}
          sx={{ mb: 3, width: 300 }}
        />

        <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center' }}>
          <Autocomplete
            sx={{ width: 300 }}
            options={barangList}
            getOptionLabel={(option) => option.nama}
            value={selectedBarang}
            onChange={(event, newValue) => setSelectedBarang(newValue)}
            renderInput={(params) => <TextField {...params} label="Pilih Barang" />}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            clearOnEscape
          />

          <TextField
            label="Jumlah"
            type="number"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            sx={{ width: 100 }}
            inputProps={{ min: 1 }}
          />

          <Button variant="contained" onClick={handleTambah}>Tambah Barang</Button>
        </Box>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nama Barang</TableCell>
              <TableCell>Harga</TableCell>
              <TableCell>Jumlah</TableCell>
              <TableCell>Subtotal</TableCell>
              <TableCell>Aksi</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {keranjang.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">Keranjang kosong</TableCell>
              </TableRow>
            ) : (
              keranjang.map(item => (
                <TableRow key={item.id}>
                  <TableCell>{item.nama}</TableCell>
                  <TableCell>{item.harga.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</TableCell>
                  <TableCell>{item.qty}</TableCell>
                  <TableCell>{(item.harga * item.qty).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</TableCell>
                  <TableCell>
                    <Button color="error" onClick={() => handleHapusItem(item.id)}>Hapus</Button>
                  </TableCell>
                </TableRow>
              ))
            )}
            {keranjang.length > 0 && (
              <TableRow>
                <TableCell colSpan={3} align="right"><b>Total Harga</b></TableCell>
                <TableCell><b>{totalHarga.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</b></TableCell>
                <TableCell></TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <Button
          variant="contained"
          color="success"
          sx={{ mt: 3 }}
          onClick={handleSimpanOrder}
          disabled={keranjang.length === 0 || loading}
        >
          {loading ? 'Menyimpan...' : 'Simpan Order'}
        </Button>
      </Box>
    </Box>
  );
}
