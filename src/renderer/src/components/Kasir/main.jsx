import React, { useState } from 'react';
import { Box, Drawer, List, ListItemButton, ListItemText, Typography, Toolbar, AppBar } from '@mui/material';

const drawerWidth = 240;

export default function main() {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleListItemClick = (index) => {
    setSelectedIndex(index);
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* AppBar atas */}
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Dashboard Pengiriman
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Drawer (sidebar) */}
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
          <ListItemButton
            selected={selectedIndex === 0}
            onClick={() => handleListItemClick(0)}
          >
            <ListItemText primary="Create Order" />
          </ListItemButton>
          <ListItemButton
            selected={selectedIndex === 1}
            onClick={() => handleListItemClick(1)}
          >
            <ListItemText primary="Kirim" />
          </ListItemButton>
        </List>
      </Drawer>

      {/* Konten utama */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {selectedIndex === 0 && (
          <>
            <Typography variant="h4" gutterBottom>
              Create Order
            </Typography>
            <Typography>Form input untuk membuat order akan muncul di sini.</Typography>
          </>
        )}
        {selectedIndex === 1 && (
          <>
            <Typography variant="h4" gutterBottom>
              Kirim
            </Typography>
            <Typography>Daftar order yang siap dikirim akan muncul di sini.</Typography>
          </>
        )}
      </Box>
    </Box>
  );
}
