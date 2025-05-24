import React, { useEffect, useState } from 'react';
import NavbarPengiriman from './NavbarPengiriman';
import { Box, Toolbar, Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    window.api.getOrder()
      .then(data => setOrders(data))
      .catch(() => setOrders([]));
  }, []);

  return (
    <Box sx={{ display: 'flex' }}>
      <NavbarPengiriman />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Typography variant="h4" gutterBottom>Orderan Belum Dikirim</Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Nama Pembeli</TableCell>
                <TableCell>Harga Total</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
      {orders.length === 0 ? (
        <TableRow>
          <TableCell colSpan={5} align="center">Tidak ada order</TableCell>
        </TableRow>
      ) : (
        orders.map(order => (
          <TableRow key={order.id}>
            <TableCell>{order.id}</TableCell>
            <TableCell>{order.nama_pembeli}</TableCell>
            <TableCell>{Number(order.harga_total).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</TableCell>
            <TableCell>{order.status}</TableCell>
            <TableCell>
              <Button
                variant="outlined"
                size="small"
                onClick={() => navigate(`/pengiriman/edit/${order.id}`)}
              >
                Edit
              </Button>
            </TableCell>
          </TableRow>
        ))
      )}
    </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}
