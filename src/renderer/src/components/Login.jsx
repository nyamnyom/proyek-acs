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
    <Box
      sx={{
        width: 350,
        margin: 'auto',
        marginTop: 10,
      }}
    >
      <Paper elevation={3} sx={{ padding: 4 }}>
        <Typography variant="h5" mb={3} textAlign="center" fontWeight="bold">
          Login
        </Typography>

        <form
          onSubmit={(e) => {
            e.preventDefault(); // hindari reload halaman
            handleLogin();
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