import React, { useEffect, useState } from 'react';
import {
  Box, Toolbar, Typography, TextField, Button,
  Table, TableHead, TableRow, TableCell, TableBody,
  Autocomplete, Alert, Paper
} from '@mui/material';
import Swal from 'sweetalert2';
import NavbarKasir from './NavbarKasir'; 

export default function CreateOrderKasir() {
  const [barangList, setBarangList] = useState([]);
  const [selectedBarang, setSelectedBarang] = useState(null);
  const [qty, setQty] = useState('');
  const [keranjang, setKeranjang] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  // const [namaPembeli, setNamaPembeli] = useState('');

  useEffect(() => {
    async function fetchBarang() {
      try {
        const data = await window.api.getBarang();
        setBarangList(data);
      } catch (err) {
        setError('Gagal memuat data barang');
      }
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

    // Cek apakah barang sudah ada di keranjang
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

    // Reset form
    setSelectedBarang(null);
    setQty('');
  };

  const totalHarga = keranjang.reduce((acc, cur) => acc + cur.harga * cur.qty, 0);

  const handleHapusItem = (id) => {
    setKeranjang(keranjang.filter(item => item.id !== id));
  };

  const handleUbahQty = (id, newQty) => {
    if (newQty <= 0) return;
    
    const barang = barangList.find(b => b.id === id);
    if (newQty > barang.stok) {
      setError(`Stok tidak cukup. Stok tersedia: ${barang.stok}`);
      return;
    }

    const newKeranjang = keranjang.map(item => 
      item.id === id ? { ...item, qty: newQty } : item
    );
    setKeranjang(newKeranjang);
    setError('');
  };

  const handleSimpanOrder = async () => {
    setError('');
    
    if (keranjang.length === 0) {
      setError('Keranjang masih kosong');
      return;
    }
    
    setLoading(true);
    try {
      console.log(keranjang);
      const jsonKeranjang = keranjang.map(item => ({
        id:item.id,
        nama_barang: item.nama,
        harga_barang: item.harga,
        jumlah_barang: item.qty,
        total_harga: item.harga * item.qty
      }));
      const result = await window.api.createNota(totalHarga, jsonKeranjang);

      if (result.success) {
        // Update stok lokal
        const updatedBarangList = barangList.map(b => {
          const itemKeranjang = keranjang.find(k => k.id === b.id);
          if (itemKeranjang) {
            console.log(itemKeranjang.qty)
            return { ...b, stok: b.stok - itemKeranjang.qty };
          }
          return b;
        });
        setBarangList(updatedBarangList);
        
        // Reset form
        setKeranjang([]);
        console.log(result);
        Swal.fire({
          title: 'Order Berhasil Dibuat!',
          text: `ID Nota: ${result.notaId}`,
          icon: 'success',
          confirmButtonText: 'OK'
        });
      } else {
        setError(result.message || 'Gagal membuat order');
      }
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan saat membuat order');
    }
    setLoading(false);
  };

  const handleReset = () => {
    setKeranjang([]);
    setSelectedBarang(null);
    setQty('');
    setError('');
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <NavbarKasir />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Typography variant="h4" gutterBottom color="primary">
          Buat Order Baru
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Tambah Barang
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <Autocomplete
              sx={{ minWidth: 300, flex: 1 }}
              options={barangList}
              getOptionLabel={(option) => `${option.nama} (Stok: ${option.stok})`}
              value={selectedBarang}
              onChange={(event, newValue) => setSelectedBarang(newValue)}
              renderInput={(params) => (
                <TextField {...params} label="Pilih Barang" />
              )}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              clearOnEscape
            />

            <TextField
              label="Jumlah"
              type="number"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              sx={{ width: 120 }}
              inputProps={{ min: 1 }}
            />

            <Button 
              variant="contained" 
              onClick={handleTambah}
              disabled={!selectedBarang || !qty}
            >
              Tambah
            </Button>
          </Box>

          {selectedBarang && (
            <Box sx={{ p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
              <Typography variant="body2">
                <strong>Harga:</strong> {selectedBarang.harga.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })} |
                <strong> Stok Tersedia:</strong> {selectedBarang.stok}
              </Typography>
            </Box>
          )}
        </Paper>

        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Keranjang Belanja
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Nama Barang</strong></TableCell>
                <TableCell><strong>Harga Satuan</strong></TableCell>
                <TableCell><strong>Jumlah</strong></TableCell>
                <TableCell><strong>Subtotal</strong></TableCell>
                <TableCell><strong>Aksi</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {keranjang.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      Keranjang masih kosong
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                keranjang.map(item => (
                  <TableRow key={item.id}>
                    <TableCell>{item.nama}</TableCell>
                    <TableCell>
                      {item.harga.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
                    </TableCell>
                    <TableCell>
                      <TextField
                        type="number"
                        value={item.qty}
                        onChange={(e) => handleUbahQty(item.id, parseInt(e.target.value))}
                        inputProps={{ min: 1, max: item.stok }}
                        sx={{ width: 80 }}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <strong>
                        {(item.harga * item.qty).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
                      </strong>
                    </TableCell>
                    <TableCell>
                      <Button 
                        color="error" 
                        size="small"
                        onClick={() => handleHapusItem(item.id)}
                      >
                        Hapus
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
              {keranjang.length > 0 && (
                <TableRow>
                  <TableCell colSpan={3} align="right">
                    <Typography variant="h6">
                      <strong>Total Harga:</strong>
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h6" color="primary">
                      <strong>
                        {totalHarga.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
                      </strong>
                    </Typography>
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Paper>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            onClick={handleReset}
            disabled={keranjang.length === 0 }
          >
            Reset
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={handleSimpanOrder}
            disabled={keranjang.length === 0 || loading}
            size="large"
          >
            {loading ? 'Memproses...' : 'Simpan Order'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}