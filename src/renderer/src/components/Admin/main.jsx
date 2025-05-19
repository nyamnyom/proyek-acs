import React, { useState } from 'react';
import { Box, Drawer, List, ListItemButton, ListItemText, Typography, Toolbar, AppBar } from '@mui/material';
import User from "./user_page/User";
import editUser from "./user_page/edit_user";

const drawerWidth = 240;

export default function main() {
  const [page, setPage] = useState("user");
  const [userId, setUserId] = useState();

  const handleListItemClick = (index) => {
    setPage(index);
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* AppBar atas */}
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Dashboard Admin
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
            selected={page == "user"}
            onClick={() => handleListItemClick("user")}
          >
            <ListItemText primary="User" />
          </ListItemButton>
          <ListItemButton
            selected={page == "barang"}
            onClick={() => handleListItemClick("barang")}
          >
            <ListItemText primary="Barang" />
          </ListItemButton>
          <ListItemButton
            selected={page == "history"}
            onClick={() => handleListItemClick("history")}
          >
            <ListItemText primary="History" />
          </ListItemButton>
        </List>
      </Drawer>

      {/* Konten utama */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
          {/* manajemen user*/}
          {page == "user" && (<User setPage={setPage}></User>)}
          {page == "edit_user" && (<editUser setPage={setPage}></editUser>)}


        {page == "barang" && (
          <>
            <Typography variant="h4" gutterBottom>
              Barang
            </Typography>
            <Typography>Barang</Typography>
          </>
        )}
        {page == "history" && (
          <>
            <Typography variant="h4" gutterBottom>
              History
            </Typography>
            <Typography>History</Typography>
          </>
        )}
      </Box>
    </Box>
  );
}
