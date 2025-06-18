import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Typography,
  Toolbar,
  AppBar,
  Button,
  ListItemIcon,
  Avatar,
  Divider,
  Chip
} from '@mui/material';
import {
  ShoppingCart,
  History,
  Logout,
  PointOfSale
} from '@mui/icons-material';

const drawerWidth = 260;

const colors = {
  primary: '#2e7d32',
  secondary: '#f44336',
  hoverRed: '#c62828',
  white: '#ffffff',
  drawerBg: '#e8f5e9',
  selectedMenu: '#2e7d32',
  selectedMenuHover: '#1b5e20',
  iconDefault: '#2e7d32',
  shiftBg: 'rgba(76, 175, 80, 0.1)',
  chipBg: 'rgba(255, 255, 255, 0.2)',
  chipBorder: 'rgba(255, 255, 255, 0.3)',
  drawerBorder: 'rgba(0,0,0,0.08)',
  shadow: '0 4px 20px rgba(0,0,0,0.1)',
};

export default function NavbarKasir() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    navigate("/", { replace: true });
  };

  const menuItems = [
    { text: 'Buat Order', path: '/kasir/create-order-kasir', icon: <ShoppingCart /> },
    { text: 'Riwayat Transaksi', path: '/kasir/riwayat-transaksi', icon: <History /> },
  ];

  const handleMenuClick = (path) => {
    navigate(path);
  };

  return (
    <>
      <AppBar 
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: colors.primary,
          boxShadow: colors.shadow,
        }}
      >
        <Toolbar sx={{ minHeight: '70px !important' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              sx={{
                backgroundColor: colors.primary,
                width: 40,
                height: 40,
                boxShadow: '0 3px 10px rgba(0,0,0,0.2)',
              }}
            >
              <PointOfSale />
            </Avatar>
            <Box>
              <Typography variant="h6" noWrap sx={{ fontWeight: 700 }}>
                Toko Kelontong Keluarga
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.9, fontWeight: 500 }}>
                Kasir Panel
              </Typography>
            </Box>
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          <Chip
            label="Ready"
            size="small"
            sx={{
              backgroundColor: colors.chipBg,
              color: colors.white,
              border: `1px solid ${colors.chipBorder}`,
              fontWeight: 600,
              mr: 2,
            }}
          />

          <Button
            variant="contained"
            size="medium"
            onClick={handleLogout}
            startIcon={<Logout />}
            sx={{
              backgroundColor: colors.secondary,
              borderRadius: '25px',
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              boxShadow: '0 3px 15px rgba(244, 67, 54, 0.3)',
              '&:hover': {
                backgroundColor: colors.hoverRed,
                boxShadow: '0 5px 20px rgba(244, 67, 54, 0.4)',
                transform: 'translateY(-1px)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: colors.drawerBg,
            borderRight: `1px solid ${colors.drawerBorder}`,
            boxShadow: '4px 0 20px rgba(0,0,0,0.05)',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: colors.primary, fontWeight: 600, mb: 0.5 }}>
            Kasir Toko Kelontong
          </Typography>
          <Divider sx={{ backgroundColor: 'rgba(46, 125, 50, 0.1)' }} />
        </Box>

        <List sx={{ px: 1 }}>
          {menuItems.map((item) => (
            <ListItemButton
              key={item.path}
              selected={location.pathname === item.path}
              onClick={() => handleMenuClick(item.path)}
              sx={{
                mb: 1,
                borderRadius: '12px',
                mx: 1,
                transition: 'all 0.3s ease',
                '&.Mui-selected': {
                  backgroundColor: colors.selectedMenu,
                  color: colors.white,
                  boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)',
                  '&:hover': {
                    backgroundColor: colors.selectedMenuHover,
                  },
                  '& .MuiListItemIcon-root': {
                    color: colors.white,
                  },
                  '& .MuiListItemText-primary': {
                    fontWeight: 600,
                  },
                },
                '&:hover': {
                  backgroundColor: 'rgba(76, 175, 80, 0.08)',
                  transform: 'translateX(4px)',
                },
                '&:not(.Mui-selected) .MuiListItemIcon-root': {
                  color: colors.iconDefault,
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: '40px' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontSize: '0.9rem',
                  fontWeight: location.pathname === item.path ? 600 : 500,
                }}
              />
            </ListItemButton>
          ))}
        </List>

        <Box sx={{ mt: 'auto', p: 1 }}>
          <Box
            sx={{
              backgroundColor: colors.shiftBg,
              borderRadius: '12px',
              p: 2,
              textAlign: 'center',
              border: `1px solid rgba(76, 175, 80, 0.2)`,
            }}
          >
            <Typography variant="caption" sx={{ display: 'block', color: '#666' }}>
              Shift: 08:00 - 17:00
            </Typography>
          </Box>
        </Box>
      </Drawer>
    </>
  );
}
