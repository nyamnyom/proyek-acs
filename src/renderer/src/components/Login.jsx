import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography, Paper, Grid, Avatar, Link } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'; // Icon untuk judul

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    const result = await window.api.loginUser(username, password);
    if (result) {
      const role = result.status.toLowerCase(); // admin, kasir, pengiriman
      navigate(`/${role}`);
    } else {
      alert('Login gagal. Cek username/password.');
    }
  };

  return (
    // Container utama dengan background gradient
    <Grid container component="main" sx={{ height: '85vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      {/* Sisi Kiri: Kolom untuk visual/branding */}
      <Grid
        item
        xs={false} // tidak tampil di layar extra-small
        sm={4}
        md={7}
        sx={{
          backgroundImage: 'url(https://source.unsplash.com/random?groceries)', // Gambar random dari Unsplash bertema groceries
          backgroundRepeat: 'no-repeat',
          backgroundColor: (t) =>
            t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      
      {/* Sisi Kanan: Kolom untuk Form Login */}
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <Box
          sx={{
            my: 8, // margin atas dan bawah
            mx: 4, // margin kiri dan kanan
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {/* Avatar dengan Icon Gembok */}
          <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5" fontWeight="bold">
            Selamat Datang!
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Masuk untuk melanjutkan ke Toko Kelontong Anda
          </Typography>

          {/* Form Login */}
          <Box component="form" noValidate onSubmit={(e) => { e.preventDefault(); handleLogin(); }} sx={{ mt: 3, width: '100%' }}>
            <TextField
              label="Username"
              variant="outlined"
              fullWidth
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus // Langsung fokus ke input ini
            />

            <TextField
              label="Password"
              variant="outlined"
              fullWidth
              margin="normal"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {/* Tombol Login yang lebih menonjol */}
            <Button
              variant="contained"
              color="primary"
              fullWidth
              type="submit"
              sx={{ mt: 3, mb: 2, padding: '12px', fontWeight: 'bold' }}
            >
              Login
            </Button>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}

export default Login;