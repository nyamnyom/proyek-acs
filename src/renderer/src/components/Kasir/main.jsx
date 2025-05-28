import React from 'react';
import { Box, Toolbar } from '@mui/material';
import { Routes, Route, Navigate } from 'react-router-dom';
import NavbarKasir from './NavbarKasir';
import CreateOrderKasir from './CreateOrderKasir';
// Import halaman kasir lain jika ada

export default function MainKasir() {
  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar / Navbar */}
      <NavbarKasir />

      {/* Area Utama */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Routes>
          {/* Default redirect saat buka /kasir */}
          <Route path="/" element={<Navigate to="create-order-kasir" replace />} />
          
          {/* Routing halaman-halaman kasir */}
          <Route path="create-order-kasir" element={<CreateOrderKasir />} />
          {/* Tambahkan route lain di sini jika perlu */}
        </Routes>
      </Box>
    </Box>
  );
}