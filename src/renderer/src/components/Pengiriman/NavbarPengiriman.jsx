import React from 'react';
import {
  AppBar, Toolbar, Typography, Drawer, List,
  ListItemButton, ListItemText, Box, Button, ListItemIcon,
  Avatar, Divider, Chip
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LocalShipping, ListAlt, AddCircle, Send, Logout
} from '@mui/icons-material';

const drawerWidth = 260;

// Warna-warna konstan
const COLOR = {
  primary: '#f57c00',
  primaryLight: '#ffcc80',
  primaryDark: '#ef6c00',
  accent: '#ff9800',
  danger: '#e53935',
  success: '#4caf50',
  backgroundDrawer: '#fff3e0',
  backgroundDrawerDark: '#ffe0b2',
  white: '#ffffff',
  grayText: '#666',
};

export default function NavbarPengiriman() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { text: 'List Order', path: '/pengiriman/order', icon: <ListAlt /> },
    { text: 'Create Order', path: '/pengiriman/create', icon: <AddCircle /> },
    { text: 'Kirim', path: '/pengiriman/kirim', icon: <Send /> },
  ];

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: COLOR.primary,
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        }}
      >
        <Toolbar sx={{ minHeight: '70px !important' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              sx={{
                backgroundColor: COLOR.accent,
                width: 40,
                height: 40,
                boxShadow: '0 3px 10px rgba(0,0,0,0.2)',
              }}
            >
              <LocalShipping />
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: '0.5px' }}>
                Toko Kelontong Keluarga
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.9, fontWeight: 500 }}>
                Logistics Panel
              </Typography>
            </Box>
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          <Chip
            label="On Duty"
            size="small"
            sx={{
              backgroundColor: 'rgba(255,255,255,0.2)',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.3)',
              fontWeight: 600,
              mr: 2,
            }}
          />

          <Button
            variant="contained"
            onClick={handleLogout}
            startIcon={<Logout />}
            sx={{
              backgroundColor: COLOR.danger,
              borderRadius: '25px',
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              boxShadow: '0 3px 10px rgba(229, 57, 53, 0.3)',
              '&:hover': {
                backgroundColor: '#d32f2f',
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
            backgroundColor: COLOR.backgroundDrawer,
            borderRight: '1px solid rgba(0,0,0,0.08)',
            boxShadow: '4px 0 20px rgba(0,0,0,0.05)',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: COLOR.primary, fontWeight: 600 }}>
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
                '&.Mui-selected': {
                  backgroundColor: COLOR.primary,
                  color: 'white',
                  '& .MuiListItemIcon-root': { color: 'white' },
                  '& .MuiListItemText-primary': { fontWeight: 600 },
                },
                '&:hover': {
                  backgroundColor: 'rgba(255, 152, 0, 0.08)',
                  transform: 'translateX(4px)',
                },
                '& .MuiListItemIcon-root': {
                  color: location.pathname === item.path ? 'white' : COLOR.primary,
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: '40px' }}>{item.icon}</ListItemIcon>
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

        {/* <Box sx={{ px: 2, mt: 2 }}>
          <Typography
            variant="caption"
            sx={{
              color: COLOR.grayText,
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
                backgroundColor: 'rgba(255, 152, 0, 0.1)',
                border: '1px solid rgba(255, 152, 0, 0.2)',
                borderRadius: '8px',
                p: 1.5,
              }}
            >
              <Typography variant="caption" sx={{ color: COLOR.grayText }}>
                Pending Orders
              </Typography>
              <Typography variant="h6" sx={{ color: COLOR.primary, fontWeight: 700 }}>
                12
              </Typography>
            </Box>
            <Box
              sx={{
                backgroundColor: 'rgba(76, 175, 80, 0.1)',
                border: '1px solid rgba(76, 175, 80, 0.2)',
                borderRadius: '8px',
                p: 1.5,
              }}
            >
              <Typography variant="caption" sx={{ color: COLOR.grayText }}>
                Delivered Today
              </Typography>
              <Typography variant="h6" sx={{ color: COLOR.success, fontWeight: 700 }}>
                8
              </Typography>
            </Box>
          </Box>
        </Box> */}
      </Drawer>
    </>
  );
}
