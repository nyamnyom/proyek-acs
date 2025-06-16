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
  ButtonGroup, 
  Popper, 
  Grow, 
  Paper, 
  ClickAwayListener, 
  MenuList, 
  MenuItem,
  ListItemIcon,
  Avatar,
  Divider,
  Chip
} from '@mui/material';
import User from "./user_page/User";
import Dashboard from "./dashboard.jsx";
import Barang from "./barang_page/Barang";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import HistoryOrder from './history_page/history_page';
import NotaReport from './Report/nota';
// Import icons untuk menu
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import InventoryIcon from '@mui/icons-material/Inventory';
import HistoryIcon from '@mui/icons-material/History';
import LogoutIcon from '@mui/icons-material/Logout';
import StoreIcon from '@mui/icons-material/Store';

const drawerWidth = 260;
const options = ['History Order', 'History Kirim', 'History Nota'];

export default function main() {
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

  // Menu items configuration
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
    { id: 'user', label: 'User Management', icon: <PeopleIcon /> },
    { id: 'barang', label: 'Inventory', icon: <InventoryIcon /> },
    { id: 'history', label: 'History', icon: <HistoryIcon /> },
  ];

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Enhanced AppBar */}
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <Toolbar sx={{ minHeight: '70px !important' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              sx={{
                background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                width: 40,
                height: 40,
                boxShadow: '0 3px 10px rgba(0,0,0,0.2)',
              }}
            >
              <StoreIcon />
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
                Toko Kelontong
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  opacity: 0.9,
                  fontSize: '0.75rem',
                  fontWeight: 500,
                }}
              >
                Admin Panel
              </Typography>
            </Box>
          </Box>
      
          {/* Spacer */}
          <Box sx={{ flexGrow: 1 }} />

          {/* Status Badge */}
          <Chip
            label="Online"
            size="small"
            sx={{
              backgroundColor: 'rgba(76, 175, 80, 0.2)',
              color: '#4caf50',
              border: '1px solid rgba(76, 175, 80, 0.3)',
              fontWeight: 600,
              mr: 2,
            }}
          />
      
          <Button
            variant="contained"
            size="medium"
            onClick={handleLogout}
            startIcon={<LogoutIcon />}
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
            background: 'linear-gradient(180deg, #f8f9fa 0%, #e9ecef 100%)',
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
              color: '#1E90FF',
              fontWeight: 600,
              mb: 0.5,
            }}
          >
            Admin Toko Kelontong
          </Typography>
          <Divider sx={{ backgroundColor: 'rgba(0,0,0,0.08)' }} />
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
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'white',
                  },
                  '& .MuiListItemText-primary': {
                    fontWeight: 600,
                  },
                },
                '&:hover': {
                  backgroundColor: 'rgba(102, 126, 234, 0.08)',
                  transform: 'translateX(4px)',
                },
                '&:not(.Mui-selected)': {
                  '& .MuiListItemIcon-root': {
                    color: '#666',
                  },
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

      {/* Enhanced Main Content */}
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: 3,
          backgroundColor: '#f8f9fa',
          minHeight: '100vh',
          backgroundImage: `
            radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.3) 0%, transparent 50%)
          `,
        }}
      >
        <Toolbar />
        
        {/* Content wrapper with enhanced styling */}
        <Box
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            p: 3,
            minHeight: 'calc(100vh - 140px)',
          }}
        >
          {page === "user" && <User />}
          {page === "dashboard" && <Dashboard />}
          {page === "barang" && <Barang />}
          {page === "history" && <HistoryOrder defaultTab={selectedHistoryTab} setSelectedTab={setSelectedHistoryTab} />}
        </Box>
      </Box>
    </Box>
  );
}