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
  Receipt,
  History,
  Logout,
  PointOfSale,
  AccountCircle
} from '@mui/icons-material';

const drawerWidth = 260;

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
      {/* Enhanced AppBar */}
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          background: 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <Toolbar sx={{ minHeight: '70px !important' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              sx={{
                background: 'linear-gradient(45deg, #66bb6a 30%, #43a047 90%)',
                width: 40,
                height: 40,
                boxShadow: '0 3px 10px rgba(0,0,0,0.2)',
              }}
            >
              <PointOfSale />
            </Avatar>
            <Box>
              <Typography 
                variant="h6" 
                noWrap 
                component="div"
                sx={{
                  fontWeight: 700,
                  letterSpacing: '0.5px',
                  textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                }}
              >
                Toko Kelontong Keluarga
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  opacity: 0.9,
                  fontSize: '0.75rem',
                  fontWeight: 500,
                }}
              >
                Kasir Panel
              </Typography>
            </Box>
          </Box>

          {/* Spacer */}
          <Box sx={{ flexGrow: 1 }} />

          {/* Kasir Status Badge */}
          <Chip
            label="Ready"
            size="small"
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.3)',
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
              background: 'linear-gradient(45deg, #f44336 30%, #e91e63 90%)',
              borderRadius: '25px',
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              boxShadow: '0 3px 15px rgba(244, 67, 54, 0.3)',
              '&:hover': {
                background: 'linear-gradient(45deg, #e53935 30%, #d81b60 90%)',
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

      {/* Enhanced Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { 
            width: drawerWidth, 
            boxSizing: 'border-box',
            background: 'linear-gradient(180deg, #f1f8e9 0%, #e8f5e8 100%)',
            borderRight: '1px solid rgba(0,0,0,0.08)',
            boxShadow: '4px 0 20px rgba(0,0,0,0.05)',
          },
        }}
      >
        <Toolbar />
        
        {/* Welcome Section */}
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#2e7d32',
              fontWeight: 600,
              mb: 0.5,
            }}
          >
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
                  background: 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)',
                  color: 'white',
                  boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #43a047 0%, #1b5e20 100%)',
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'white',
                  },
                  '& .MuiListItemText-primary': {
                    fontWeight: 600,
                  },
                },
                '&:hover': {
                  backgroundColor: 'rgba(76, 175, 80, 0.08)',
                  transform: 'translateX(4px)',
                },
                '&:not(.Mui-selected)': {
                  '& .MuiListItemIcon-root': {
                    color: '#2e7d32',
                  },
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

        {/* Bottom Section */}
        <Box sx={{ mt: 'auto', p: 1 }}>
          <Box
            sx={{
              background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(46, 125, 50, 0.1) 100%)',
              borderRadius: '12px',
              p: 2,
              textAlign: 'center',
              border: '1px solid rgba(76, 175, 80, 0.2)',
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