import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography, Paper } from '@mui/material';

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
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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

          <Button
            variant="contained"
            color="primary"
            fullWidth
            type="submit" // tombol akan ikut trigger saat tekan Enter
            sx={{ mt: 3 }}
          >
            Login
          </Button>
        </form>
      </Paper>
    </Box>
  );
}

export default Login;
