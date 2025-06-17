import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Button, 
  Container, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Divider,
  Stack,
  Toolbar
} from '@mui/material';
// import NavbarKasir from './NavbarKasir';

export default function DetailNota() {
  const { idNota } = useParams();
  const [nota, setNota] = useState(null);
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Ambil data nota berdasarkan ID
        const dataNota = await window.api.getNotaById(idNota);
        console.log('Data Nota:', dataNota);
        setNota(dataNota);
        
        // Ambil detail nota
        const dataDetails = await window.api.getDetailNota(idNota);
        console.log('Data Details:', dataDetails);
        setDetails(dataDetails);
        
      } catch (err) {
        console.error("Gagal mengambil data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (idNota) {
      fetchData();
    }
  }, [idNota]);

  const handlePrint = async () => {
    try {
      await window.api.printReport();
    } catch (err) {
      console.error("Gagal mencetak:", err);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(value);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex' }}>
        {/* <NavbarKasir /> */}
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Toolbar />
          <Container>
            <Typography variant="h6">Loading...</Typography>
          </Container>
        </Box>
      </Box>
    );
  }

  if (!nota) {
    return (
      <Box sx={{ display: 'flex' }}>
        {/* <NavbarKasir /> */}
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Toolbar />
          <Container>
            <Button 
              variant="contained" 
              color="error" 
              onClick={() => navigate(-1)}
              sx={{ mb: 2 }}
            >
              Kembali
            </Button>
            <Typography variant="h6" color="error">
              Data tidak ditemukan
            </Typography>
          </Container>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex' }}>
      {/* <NavbarKasir /> */}
      <Box component="main" sx={{ flexGrow: 1, p: 1 }}>
        <Toolbar />
        
        <Container maxWidth="md">
          {/* Header dengan tombol aksi */}
        <div className="report-buttons no-print">
            <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                <Button 
                    variant="contained" 
                    color="error" 
                    onClick={() => navigate(-1)}
                >
                Kembali
                </Button>
                <Button 
                    variant="contained" 
                    color="success" 
                    onClick={handlePrint}
                    >
                    Cetak
                </Button>
            </Stack>
        </div>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom align="center" color="primary">
              Detail Nota Pembelian
            </Typography>
            
            <Divider sx={{ mb: 3 }} />

            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Informasi Transaksi
              </Typography>
              <Stack spacing={1}>
                <Typography>
                  <strong>ID Nota:</strong> {nota.id_htrans}
                </Typography>
                <Typography>
                  <strong>Tanggal Transaksi:</strong> {formatDate(nota.created_at)}
                </Typography>
              </Stack>
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Typography variant="h6" gutterBottom>
              Detail Barang
            </Typography>
            
            <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'primary.light' }}>
                    <TableCell><strong>Nama Barang</strong></TableCell>
                    <TableCell align="right"><strong>Harga Satuan</strong></TableCell>
                    <TableCell align="right"><strong>Jumlah</strong></TableCell>
                    <TableCell align="right"><strong>Total Harga</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {details.map((item, index) => (
                    <TableRow key={index} hover>
                      <TableCell>{item.nama_barang}</TableCell>
                      <TableCell align="right">
                        {formatCurrency(item.harga_barang)}
                      </TableCell>
                      <TableCell align="right">{item.jumlah_barang}</TableCell>
                      <TableCell align="right">
                        {formatCurrency(item.total_harga)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ 
              backgroundColor: 'primary.light', 
              p: 2, 
              borderRadius: 1,
              mb: 3
            }}>
              <Typography variant="h5" align="right">
                <strong>Total Keseluruhan: {formatCurrency(nota.harga_total)}</strong>
              </Typography>
            </Box>

            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Typography variant="h6" color="primary">
                Toko Kelontong Keluarga
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Terima kasih atas kunjungan Anda
              </Typography>
            </Box>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
}