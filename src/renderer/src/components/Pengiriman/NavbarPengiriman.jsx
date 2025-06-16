import React from 'react';
import {
  AppBar, 
  Toolbar, 
  Typography, 
  Drawer, 
  List, 
  ListItemButton, 
  ListItemText, 
  Box,
  Button,
  ListItemIcon,
  Avatar,
  Divider,
  Chip
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LocalShipping,
  ListAlt,
  AddCircle,
  Send,
  Logout,
  DeliveryDining,
  LocationOn,
  Schedule
} from '@mui/icons-material';

const drawerWidth = 260;

export default function NavbarPengiriman() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { 
      text: 'List Order', 
      path: '/pengiriman/order',
      icon: <ListAlt />
    },
    { 
      text: 'Create Order', 
      path: '/pengiriman/create',
      icon: <AddCircle />
    },
    { 
      text: 'Kirim', 
      path: '/pengiriman/kirim',
      icon: <Send />
    }
  ];

  const handleLogout = () => {
    // Jika nanti kamu punya session/token, bisa dihapus di sini
    // contoh: localStorage.removeItem("token");
    navigate('/'); // kembali ke halaman login
  };

  return (
    <>
      {/* Enhanced AppBar */}
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <Toolbar sx={{ minHeight: '70px !important' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              sx={{
                background: 'linear-gradient(45deg, #ffb74d 30%, #ff8f00 90%)',
                width: 40,
                height: 40,
                boxShadow: '0 3px 10px rgba(0,0,0,0.2)',
              }}
            >
              <LocalShipping />
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
                Logistics Panel
              </Typography>
            </Box>
          </Box>

          {/* Spacer */}
          <Box sx={{ flexGrow: 1 }} />

          {/* Delivery Status Badge */}
          <Chip
            label="On Duty"
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
            background: 'linear-gradient(180deg, #fff3e0 0%, #ffe0b2 100%)',
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
              color: '#f57c00',
              fontWeight: 600,
              mb: 0.5,
            }}
          >
            Driver Toko Kelontong
          </Typography>

          <Divider sx={{ backgroundColor: 'rgba(245, 124, 0, 0.1)' }} />
        </Box>

        <List sx={{ px: 1 }}>
          {menuItems.map((item) => (
            <ListItemButton
              key={item.path}
              selected={location.pathname === item.path}
              onClick={() => navigate(item.path)}
              sx={{
                mb: 1,
                borderRadius: '12px',
                mx: 1,
                transition: 'all 0.3s ease',
                '&.Mui-selected': {
                  background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)',
                  color: 'white',
                  boxShadow: '0 4px 15px rgba(255, 152, 0, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #fb8c00 0%, #ef6c00 100%)',
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'white',
                  },
                  '& .MuiListItemText-primary': {
                    fontWeight: 600,
                  },
                },
                '&:hover': {
                  backgroundColor: 'rgba(255, 152, 0, 0.08)',
                  transform: 'translateX(4px)',
                },
                '&:not(.Mui-selected)': {
                  '& .MuiListItemIcon-root': {
                    color: '#f57c00',
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

        {/* Quick Stats Section */}
        <Box sx={{ px: 2, mt: 2 }}>
          <Typography
            variant="caption"
            sx={{
              color: '#666',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              mb: 1,
              display: 'block',
            }}
          >
            Today's Stats
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box
              sx={{
                background: 'rgba(255, 152, 0, 0.1)',
                borderRadius: '8px',
                p: 1.5,
                border: '1px solid rgba(255, 152, 0, 0.2)',
              }}
            >
              <Typography variant="caption" sx={{ color: '#666', display: 'block' }}>
                Pending Orders
              </Typography>
              <Typography variant="h6" sx={{ color: '#f57c00', fontWeight: 700 }}>
                12
              </Typography>
            </Box>
            <Box
              sx={{
                background: 'rgba(76, 175, 80, 0.1)',
                borderRadius: '8px',
                p: 1.5,
                border: '1px solid rgba(76, 175, 80, 0.2)',
              }}
            >
              <Typography variant="caption" sx={{ color: '#666', display: 'block' }}>
                Delivered Today
              </Typography>
              <Typography variant="h6" sx={{ color: '#4caf50', fontWeight: 700 }}>
                8
              </Typography>
            </Box>
          </Box>
        </Box>


      </Drawer>
    </>
  );
}