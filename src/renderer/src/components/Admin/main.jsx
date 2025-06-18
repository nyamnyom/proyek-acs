import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Button, 
  Drawer, 
  List, 
  ListItemButton, 
  ListItemText, 
  Typography, 
  Toolbar, 
  AppBar, 
  Chip,
  ListItemIcon,
  Avatar,
  Divider,
} from '@mui/material';

import User from "./user_page/User";
import Dashboard from "./dashboard.jsx";
import Barang from "./barang_page/Barang";
import HistoryOrder from './history_page/history_page';
import NotaReport from './Report/nota';

// Icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import InventoryIcon from '@mui/icons-material/Inventory';
import HistoryIcon from '@mui/icons-material/History';
import LogoutIcon from '@mui/icons-material/Logout';
import StoreIcon from '@mui/icons-material/Store';

const colors = {
  primary: '#3949ab',           
  secondary: '#f44336',         
  hoverPrimary: '#303f9f',      
  drawerBg: '#f0f0f0',          
  contentBg: '#fafafa',         
  paperBg: '#ffffff',          
  border: '#e0e0e0',
  textPrimary: '#212121',
  textSecondary: '#666',
  onlineGreen: '#4caf50',
};

const drawerWidth = 260;

export default function Main() {
  const [page, setPage] = useState("dashboard");
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

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
    { id: 'user', label: 'User Management', icon: <PeopleIcon /> },
    { id: 'barang', label: 'Inventory', icon: <InventoryIcon /> },
    { id: 'history', label: 'History', icon: <HistoryIcon /> },
  ];

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: colors.primary,
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        }}
      >
        <Toolbar sx={{ minHeight: '70px !important' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              sx={{
                backgroundColor: colors.secondary,
                width: 40,
                height: 40,
                boxShadow: '0 3px 10px rgba(0,0,0,0.2)',
              }}
            >
              <StoreIcon />
            </Avatar>
            <Box>
              <Typography variant="h6" noWrap sx={{ fontWeight: 700 }}>
                Toko Kelontong
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.9, fontWeight: 500 }}>
                Admin Panel
              </Typography>
            </Box>
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          <Chip
            label="Online"
            size="small"
            sx={{
              backgroundColor: 'rgba(76, 175, 80, 0.1)',
              color: colors.onlineGreen,
              border: '1px solid rgba(76, 175, 80, 0.3)',
              fontWeight: 600,
              mr: 2,
            }}
          />

          <Button
            variant="contained"
            onClick={handleLogout}
            startIcon={<LogoutIcon />}
            sx={{
              backgroundColor: colors.secondary,
              color: '#fff',
              borderRadius: '25px',
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              boxShadow: '0 3px 15px rgba(244, 67, 54, 0.3)',
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
            backgroundColor: colors.drawerBg,
            borderRight: `1px solid ${colors.border}`,
          },
        }}
      >
        <Toolbar />
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Typography
            variant="body2"
            sx={{
              color: colors.primary,
              fontWeight: 600,
              mb: 0.5,
            }}
          >
            Admin Toko Kelontong
          </Typography>
          <Divider />
        </Box>

        <List sx={{ px: 1 }}>
          {menuItems.map((item) => (
            <ListItemButton
              key={item.id}
              selected={page === item.id}
              onClick={() => handleListItemClick(item.id)}
              sx={{
                mb: 1,
                borderRadius: '12px',
                mx: 1,
                transition: 'all 0.3s ease',
                '&.Mui-selected': {
                  backgroundColor: colors.primary,
                  color: '#fff',
                  boxShadow: '0 4px 15px rgba(57, 73, 171, 0.3)',
                  '&:hover': {
                    backgroundColor: colors.hoverPrimary,
                  },
                  '& .MuiListItemIcon-root': {
                    color: '#fff',
                  },
                },
                '&:hover': {
                  backgroundColor: 'rgba(57, 73, 171, 0.08)',
                  transform: 'translateX(4px)',
                },
                '& .MuiListItemIcon-root': {
                  color: colors.textSecondary,
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: '40px' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontSize: '0.9rem',
                  fontWeight: page === item.id ? 600 : 500,
                }}
              />
            </ListItemButton>
          ))}
        </List>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          backgroundColor: colors.contentBg,
          minHeight: '100vh',
        }}
      >
        <Toolbar />
        <Box
          sx={{
            backgroundColor: colors.paperBg,
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.05)',
            p: 3,
            minHeight: 'calc(100vh - 140px)',
          }}
        >
          {page === "user" && <User />}
          {page === "dashboard" && <Dashboard />}
          {page === "barang" && <Barang />}
          {page === "history" && (
            <HistoryOrder
              defaultTab={selectedHistoryTab}
              setSelectedTab={setSelectedHistoryTab}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
}
