import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Alert,
} from '@mui/material';

export default function EditOrder({ idOrder }) {
  const navigate = useNavigate();

  const [namaPembeli, setNamaPembeli] = useState('');
  const [keranjang, setKeranjang] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchOrder() {
      try {
        const orderData = await window.api.getOrderById(idOrder);
        setNamaPembeli(orderData.nama_pembeli);
        setKeranjang(orderData.detail);
      } catch {
        setError('Gagal load data order');
      }
    }
    fetchOrder();
  }, [idOrder]);

  const totalHarga = keranjang.reduce((acc, cur) => acc + cur.harga_barang * cur.jumlah_barang, 0);

  const handleJumlahUpdate = (namaBarang, jumlahBaru) => {
    setKeranjang(prev =>
      prev.map(item =>
        item.nama_barang === namaBarang
          ? { ...item, jumlah_barang: jumlahBaru, total_harga: item.harga_barang * jumlahBaru }
          : item
      )
    );
  };

  const handleHapusItem = (namaBarang) => {
    setKeranjang(prev => prev.filter(item => item.nama_barang !== namaBarang));
  };

  const handleSimpan = async () => {
    setError('');
    if (keranjang.length === 0) {
      setError('Keranjang kosong');
      return;
    }
    if (!namaPembeli.trim()) {
      setError('Nama pembeli wajib diisi');
      return;
    }

    setLoading(true);
    try {
      await window.api.updateOrderNamaPembeli(idOrder, namaPembeli, totalHarga);

      for (const item of keranjang) {
        await window.api.updateJumlahBarangOrderDetail(idOrder, item.nama_barang, item.jumlah_barang);
      }

      alert('Order berhasil diupdate');
      navigate(-1); // Kembali ke halaman sebelumnya
    } catch (err) {
      setError(err.message || 'Gagal update order');
    }
    setLoading(false);
  };

  return (
    <Box p={3} maxWidth={900} mx="auto">
      <Typography variant="h5" gutterBottom>
        Edit Order #{idOrder}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TextField
        label="Nama Pembeli"
        value={namaPembeli}
        onChange={(e) => setNamaPembeli(e.target.value)}
        fullWidth
        margin="normal"
        disabled={loading}
      />

      <TableContainer component={Paper} sx={{ mt: 3 }}>
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
                <TableCell colSpan={5} align="center">
                  Keranjang kosong
                </TableCell>
              </TableRow>
            ) : (
              keranjang.map((item) => (
                <TableRow key={item.nama_barang}>
                  <TableCell>{item.nama_barang}</TableCell>
                  <TableCell>
                    {item.harga_barang.toLocaleString('id-ID', {
                      style: 'currency',
                      currency: 'IDR',
                    })}
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      inputProps={{ min: 1 }}
                      value={item.jumlah_barang}
                      onChange={async (e) => {
                        const val = parseInt(e.target.value);
                        if (!val || val < 1) return;
                        setLoading(true);
                        setError('');
                        try {
                          await window.api.updateJumlahBarangOrderDetail(idOrder, item.nama_barang, val);
                          handleJumlahUpdate(item.nama_barang, val);
                        } catch (err) {
                          setError(err.message || 'Gagal update jumlah');
                        }
                        setLoading(false);
                      }}
                      disabled={loading}
                      size="small"
                      sx={{ width: 80 }}
                    />
                  </TableCell>
                  <TableCell>
                    {item.total_harga.toLocaleString('id-ID', {
                      style: 'currency',
                      currency: 'IDR',
                    })}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => handleHapusItem(item.nama_barang)}
                      disabled={loading}
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
                  <Typography fontWeight="bold">Total Harga</Typography>
                </TableCell>
                <TableCell>
                  <Typography fontWeight="bold">
                    {totalHarga.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
                  </Typography>
                </TableCell>
                <TableCell />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box mt={3} display="flex" justifyContent="space-between">
        <Button variant="outlined" onClick={() => navigate(-1)} disabled={loading}>
          Kembali
        </Button>

        <Button
          variant="contained"
          onClick={handleSimpan}
          disabled={loading || keranjang.length === 0}
          startIcon={loading && <CircularProgress size={20} />}
        >
          {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
        </Button>
      </Box>
    </Box>
  );
}
