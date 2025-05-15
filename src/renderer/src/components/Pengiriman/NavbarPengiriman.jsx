import React from 'react';
import {
  AppBar, Toolbar, Typography, Drawer, List, ListItemButton, ListItemText, Box
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

const drawerWidth = 240;

export default function NavbarPengiriman() {
  const navigate = useNavigate();
  const location = useLocation();

  const menu = [
    { text: 'List Order', path: '/pengiriman/order' },
    { text: 'Create Order', path: '/pengiriman/create' },
    { text: 'Kirim', path: '/pengiriman/kirim' }
  ];

  const handleLogout = () => {
    // Jika nanti kamu punya session/token, bisa dihapus di sini
    // contoh: localStorage.removeItem("token");

    navigate('/'); // kembali ke halaman login
  };

  return (
    <>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap>
            Dashboard Pengiriman
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <List>
          {menu.map((item, index) => (
            <ListItemButton
              key={index}
              selected={location.pathname === item.path}
              onClick={() => navigate(item.path)}
            >
              <ListItemText primary={item.text} />
            </ListItemButton>
          ))}

          {/* Divider antara menu dan logout bisa ditambahkan jika perlu */}

          <ListItemButton onClick={handleLogout} sx={{ mt: 2 }}>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </List>
      </Drawer>
    </>
  );
}
