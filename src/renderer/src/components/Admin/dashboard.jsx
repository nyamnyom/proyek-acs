import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  List, 
  ListItem, 
  ListItemText,
  Avatar,
  Chip,
  LinearProgress
} from "@mui/material";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { DataGrid } from '@mui/x-data-grid';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import InventoryIcon from '@mui/icons-material/Inventory';
import StarIcon from '@mui/icons-material/Star';

export default function dashboard(props){
    //Data Tabel
    const [orders, setOrders] = useState([]);

    //Data Form
    const [id, setId] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [status, setStatus] = useState("");

    useEffect(() => {
      fetchOrderDetailData();
    }, []);

    async function fetchOrderDetailData() {
        try {
          const data = await window.api.getAllOrderDetail();
          setOrders(data);
          console.log(data)
        } catch (err) {
          console.error(err);
        }
    }

    const stringToColor = (str) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
          hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }

        let color = '#';
        for (let i = 0; i < 3; i++) {
          const value = (hash >> (i * 8)) & 0xff;
          color += ('00' + value.toString(16)).slice(-2);
        }
    return color;
    };

    const topProductsWithColor = orders.map(item => ({
      ...item,
      color: stringToColor(item.nama_barang) 
    }));
    
    const calculateStats = (orders) => {
        const totalProduk = orders.length;
        const totalTransaksi = orders.reduce((acc, item) => acc + item.sold, 0);
        console.log(totalProduk, totalTransaksi)
        return { totalProduk, totalTransaksi };
    };

    const { totalProduk, totalTransaksi } = calculateStats(orders);

    // Enhanced card styles
    const cardStyles = {
      borderRadius: '16px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      background: 'rgba(255, 255, 255, 0.95)',
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 12px 48px rgba(0, 0, 0, 0.15)',
      }
    };

    return (
        <Box sx={{ height: 'calc(100vh - 140px)', overflow: 'auto', p: 1 }}>
            {/* Compact Header */}
            <Box 
              sx={{ 
                mb: 2,
                textAlign: 'center',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '16px',
                p: 2,
                color: 'white',
                boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: `
                    radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
                    radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)
                  `,
                  pointerEvents: 'none',
                }
              }}
            >
              <Typography 
                variant="h4" 
                sx={{
                  fontWeight: 700,
                  textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  position: 'relative',
                  zIndex: 1,
                  mb: 0.5,
                }}
              >
                Dashboard Admin
              </Typography>
            </Box>

            <Grid container spacing={2} sx={{ height: 'calc(100% - 100px)' }}>
                {/* Compact Statistics Cards */}
                <Grid item xs={12} md={6} sx={{ maxHeight: 200 }}>
                  <Card sx={{
                    ...cardStyles,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    height: '70%',
                  }}>
                    <CardContent sx={{ p: 2, height: '90%', display: 'flex', alignItems: 'center' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                        <Box>
                          <Typography variant="caption" sx={{ opacity: 0.9, display: 'block' }}>
                            Total Transaksi
                          </Typography>
                          <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                            {totalTransaksi}
                          </Typography>
                        </Box>
                        <Avatar
                          sx={{
                            background: 'rgba(255, 255, 255, 0.2)',
                            width: 50,
                            height: 50,
                            backdropFilter: 'blur(10px)',
                          }}
                        >
                          <ShoppingCartIcon sx={{ fontSize: 24 }} />
                        </Avatar>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6} sx={{ height: '30%' }}>
                  <Card sx={{
                    ...cardStyles,
                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    color: 'white',
                    height: '85%',
                  }}>
                    <CardContent sx={{ p: 2, height: '90%', display: 'flex', alignItems: 'center' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                        <Box>
                          <Typography variant="caption" sx={{ opacity: 0.9, display: 'block' }}>
                            Total Produk
                          </Typography>
                          <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                            {totalProduk}
                          </Typography>
                        </Box>
                        <Avatar
                          sx={{
                            background: 'rgba(255, 255, 255, 0.2)',
                            width: 50,
                            height: 50,
                            backdropFilter: 'blur(10px)',
                          }}
                        >
                          <InventoryIcon sx={{ fontSize: 24 }} />
                        </Avatar>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Compact Top Products */}
                <Grid item xs={12} md={6} sx={{ height: '80%', width:'400px' }}>
                  <Card sx={{
                    ...cardStyles,
                    height: '200%',
                  }}>
                    <CardContent sx={{ p: 2, height: '200%', display: 'flex', flexDirection: 'column' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar
                          sx={{
                            background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                            mr: 1,
                            width: 32,
                            height: 32,
                          }}
                        >
                          <StarIcon sx={{ fontSize: 18 }} />
                        </Avatar>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: '#333' }}>
                          Produk Terlaris
                        </Typography>
                      </Box>
                      
                      <Box sx={{ flex: 1, overflowY: 'auto', pr: 1 }}>
                        {orders.slice(0, 8).map((product, index) => (
                          <Box 
                            key={index} 
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              p: 1,
                              mb: 0.5,
                              backgroundColor: index % 2 === 0 ? 'rgba(102, 126, 234, 0.05)' : 'transparent',
                              borderRadius: '8px',
                              border: '1px solid rgba(102, 126, 234, 0.1)',
                              transition: 'all 0.2s ease',
                              '&:hover': {
                                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                                transform: 'translateX(2px)',
                              }
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Chip
                                label={index + 1}
                                size="small"
                                sx={{
                                  background: index < 3 
                                    ? 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)' 
                                    : 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                                  color: 'white',
                                  fontWeight: 600,
                                  mr: 1,
                                  minWidth: '20px',
                                  height: '20px',
                                  fontSize: '0.7rem',
                                }}
                              />
                              <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.85rem' }}>
                                {product.nama_barang.length > 15 
                                  ? product.nama_barang.substring(0, 15) + '...' 
                                  : product.nama_barang}
                              </Typography>
                            </Box>
                            <Box sx={{ textAlign: 'right' }}>
                              <Typography variant="subtitle2" sx={{ color: '#667eea', fontWeight: 600 }}>
                                {product.sold}
                              </Typography>
                            </Box>
                          </Box>
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                    
                {/* piechart */}
                <Grid item xs={12} md={3}>
                  <Card sx={{ borderRadius: 3, boxShadow: 3, height: 300 }}>
                    <CardContent sx={{ height: '100%' }}>
                      <Typography variant="h5" gutterBottom>
                        Distribusi Penjualan
                      </Typography>
                      <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                          <Pie
                            data={topProductsWithColor}
                            dataKey="sold"
                            nameKey="nama_barang"
                            cx="50%"
                            cy="50%"
                            outerRadius={60}
                            label
                          >
                            {topProductsWithColor.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </Grid>
            </Grid>
        </Box>
    );
}