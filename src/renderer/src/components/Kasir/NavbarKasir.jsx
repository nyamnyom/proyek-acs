import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box, Drawer, List, ListItemButton, ListItemText, 
  Typography, Toolbar, AppBar, Button,
  ListItemIcon
} from '@mui/material';
import {
  ShoppingCart,
  Receipt,
  History,
  Logout
} from '@mui/icons-material';

const drawerWidth = 240;

export default function NavbarKasir() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    navigate("/", { replace: true });
  };

  const menuItems = [
    {
    text: 'Buat Order',
    path: '/kasir/create-order-kasir',
    icon: <ShoppingCart />
    },
    {
      text: 'Cetak Nota',
      path: '/kasir/cetak-nota', 
      icon: <Receipt />
    },
    {
      text: 'Riwayat Transaksi',
      path: '/kasir/riwayat-transaksi',
      icon: <History />
    }
  ];

  const handleMenuClick = (path) => {
    navigate(path);
  };

  return (
    <>
      {/* AppBar atas */}
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Dashboard Kasir
          </Typography>

          {/* Spacer untuk mendorong tombol ke kanan */}
          <Box sx={{ flexGrow: 1 }} />

          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={handleLogout}
            startIcon={<Logout />}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      {/* Drawer (sidebar) */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { 
            width: drawerWidth, 
            boxSizing: 'border-box',
            bgcolor: 'background.paper'
          },
        }}
      >
        <Toolbar />
        
        <List>
          {menuItems.map((item) => (
            <ListItemButton
              key={item.path}
              selected={location.pathname === item.path}
              onClick={() => handleMenuClick(item.path)}
              sx={{
                '&.Mui-selected': {
                  bgcolor: 'primary.light',
                  color: 'primary.contrastText',
                  '&:hover': {
                    bgcolor: 'primary.main',
                  },
                },
              }}
            >
              <ListItemIcon 
                sx={{ 
                  color: location.pathname === item.path ? 'inherit' : 'text.secondary' 
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          ))}
        </List>
        
      </Drawer>
    </>
  );
}