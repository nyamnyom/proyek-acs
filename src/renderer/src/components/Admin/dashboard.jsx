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
  Card, CardContent, Typography, Grid, List, ListItem, ListItemText 
} from "@mui/material";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { DataGrid } from '@mui/x-data-grid';


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

    return (
        <Container  sx={{ mt: 5 }}>
            <Typography variant="h4" gutterBottom>
                Dashboard Admin
            </Typography>

            <Grid container spacing={4} padding={5}>
                {/* Ringkasan Kartu */}
                <Grid item xs={12} md={3}>
                  <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
                    <CardContent>
                      <Typography variant="subtitle1">Total Transaksi</Typography>
                      <Typography variant="h5" color="primary">{totalTransaksi}</Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={3}>
                  <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
                    <CardContent>
                      <Typography variant="subtitle1">Total Produk</Typography>
                      <Typography variant="h5" color="success.main">{totalProduk}</Typography>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Produk Terlaris */}
                <Grid item xs={12} md={3}>
                  <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
                    <CardContent>
                      <Typography variant="h5" gutterBottom>
                        Produk Terlaris
                      </Typography>
                      {orders.map((p, i) => (
                        <Box key={i} display="flex" justifyContent="space-between" mb={1} gap={4}>
                          <Typography variant="body1">{p.nama_barang}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            Terjual: {p.sold}
                          </Typography>
                        </Box>
                      ))}
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
        </Container>
    );
}