import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Drawer, List, ListItemButton, ListItemText, Typography, Toolbar, AppBar, ButtonGroup, Popper, Grow, Paper, ClickAwayListener, MenuList, MenuItem } from '@mui/material';
import User from "./user_page/User";
import Barang from "./barang_page/Barang";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import HistoryOrder from './history_page/history_page';

const drawerWidth = 240;
const options = ['History Order', 'History Kirim', 'History Nota'];
export default function main() {
  const [page, setPage] = useState("user");
  const [selectedHistoryTab, setSelectedHistoryTab] = useState(0);
  const navigate = useNavigate();

  const handleListItemClick = (index) => {
    if (index === "history") {
      setPage("history");
      setSelectedHistoryTab(0);
    } else {
      setPage(index);
    }
  };

  const handleLogout = () => {
    navigate("/", { replace: true });
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* AppBar atas */}
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Dashboard Admin
          </Typography>
      
          {/* Spacer untuk mendorong tombol ke kanan */}
          <Box sx={{ flexGrow: 1 }} />
      
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={handleLogout}
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
          {page == "user" && (<User></User>)}
          {page == "barang" && (<Barang></Barang>)}
          {page === "history" && <HistoryOrder defaultTab={selectedHistoryTab} setSelectedTab={setSelectedHistoryTab} />}
          {page === "history_kirim" && (
            <>
              <Typography variant="h4" gutterBottom>History Kirim</Typography>
              <Typography>Isi halaman History Kirim</Typography>
            </>
          )}
          {page === "history_nota" && (
            <>
              <Typography variant="h4" gutterBottom>History Nota</Typography>
              <Typography>Isi halaman History Nota</Typography>
            </>
          )}
      </Box>
    </Box>
  );
}
