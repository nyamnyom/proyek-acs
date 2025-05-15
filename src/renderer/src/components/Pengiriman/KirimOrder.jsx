import React from 'react';
import NavbarPengiriman from './NavbarPengiriman';
import { Box, Toolbar, Typography } from '@mui/material';

export default function KirimOrder() {
  return (
    <Box sx={{ display: 'flex' }}>
      <NavbarPengiriman />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Typography variant="h4" gutterBottom>Pengiriman</Typography>
        <Typography>Daftar order yang siap dikirim akan muncul di sini.</Typography>
      </Box>
    </Box>
  );
}
