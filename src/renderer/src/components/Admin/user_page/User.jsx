import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import Swal from "sweetalert2";


export default function user(props){
    //Data Tabel
    const [users, setUsers] = useState([]);

    //Data Form
    const [id, setId] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [status, setStatus] = useState("");

    useEffect(() => {
      fetchUserData();
    }, []);

    async function fetchUserData() {
        try {
          const data = await window.api.getUser();
          setUsers(data);
          console.log(data)
        } catch (err) {
          console.error(err);
        }
    }

    async function handleToEdit(item) {
      console.log(item)
      setId(item.id)
      setUsername(item.username)
      setPassword(item.password)
      setStatus(item.status)
    }

    async function handleDelete(item_id) { //trouble karena beda id
      const result = await window.api.deleteUser(item_id);
      if (result.success) {
        alert("User deleted successfully");
        fetchUserData();
      } else {
        alert(`Error: ${result.message}`);
      }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (id == "") {
            let cek = true;
            users.forEach(u => {
              if (u.username == username && u.status == status){
                cek = false;
              }
            });
            if (cek){
              const result = await window.api.insertUser(
                username,
                password,
                status,
              );
        
              if (result.success) {
                Swal.fire({
                  title: 'Sukses membuat user!',
                  text: `User ${username} berhasil dibuat`,
                  icon: 'success',
                  confirmButtonText: 'OK'
                });
                setId("");
                setUsername('');
                setPassword('');
                setStatus('');
                fetchUserData();
              } else {
                Swal.fire({
                  title: 'Gagal membuat user!',
                  text: `Error: ${result.message}`,
                  icon: 'error',
                  confirmButtonText: 'OK'
                });
              }
            }
            else{
              Swal.fire({
                  title: 'Gagal membuat user!',
                  text: `Error: Username telah diambil`,
                  icon: 'error',
                  confirmButtonText: 'OK'
                });
            }
        } else {
            let cek = true;
            users.forEach(u => {
              if (u.username == username && u.status == status){
                cek = false;
              }
            });
            if (cek){
              const result = await window.api.editUser(
                id,
                username,
                password,
                status,
              );
              if (result.success) {
                Swal.fire({
                  title: 'Sukses mengedit user!',
                  text: `User ${username} berhasil diedit`,
                  icon: 'success',
                  confirmButtonText: 'OK'
                });
                setId("");
                setUsername('');
                setPassword('');
                setStatus('');
                fetchUserData();
              } else {
                setId("");
                setUsername('');
                setPassword('');
                setStatus('');
                fetchUserData();
                Swal.fire({
                  title: 'Gagal mengedit user!',
                  text: `Error: ${result.message}`,
                  icon: 'error',
                  confirmButtonText: 'OK'
                });
              }
            }
            else{
              Swal.fire({
                  title: 'Gagal mengedit user!',
                  text: `Error: Username telah diambil`,
                  icon: 'error',
                  confirmButtonText: 'OK'
                });
            }
        } 
    };

    const userColumns = [
        { field: "id", headerName: "User ID", flex: 1 },
        { field: "username", headerName: "Username", flex: 1 },
        { field: "password", headerName: "Password", flex: 1 },
        { field: "status", headerName: "Status", flex: 1 },
        {
          field: "actions",
          headerName: "Actions",
          flex: 1,
          renderCell: (params) => (
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={() => handleToEdit((params.row))}
              >
                Edit
              </Button>
              <Button
                variant="contained"
                color="error"
                size="small"
                onClick={() => handleDelete((params.row.id) )}
              >
                Delete
              </Button>
            </Stack>
          ),
        },
    ];

    return(
        <Container  sx={{ mt: 5 }}>
            <Typography variant="h4" gutterBottom>
                Manajemen User
            </Typography>

            {/* Section: Tabel Barang */}
            <Box sx={{ height: 300 }}>
              <DataGrid
                rows={users}
                columns={userColumns}
                getRowId={(row) => row.id}
                pageSizeOptions={[5, 10]}
                initialState={{
                  pagination: { paginationModel: { page: 0, pageSize: 5 } },
                }}
              />
            </Box>

            {/* Section: Form Tambah Barang */}
            <Paper elevation={3} sx={{ p: 3, width:'50%', mt: 5}}>
                <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <Grid item xs={12} >
                        <TextField
                            sx={{ display: 'none' }}
                            fullWidth
                            value={id}
                            onChange={(e) => setId(e.target.value)}
                            size="small"
                        />
                    </Grid>
                    <Grid item xs={12} >
                        <TextField
                            fullWidth
                            required
                            label="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            size="small"
                        />
                    </Grid>
                    <Grid item xs={12} >
                        <TextField
                            fullWidth
                            required
                            label="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            size="small"
                        />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl fullWidth size="small">
                        <InputLabel id="status-select">Status</InputLabel>
                        <Select
                            labelId="status-select"
                            value={status}
                            label="Status"
                            required
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <MenuItem value="Admin">Admin</MenuItem>
                            <MenuItem value="Kasir">Kasir</MenuItem>
                            <MenuItem value="Pengiriman">Pengiriman</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            disabled={!username || !password || !status}
                        >
                            {id ? "Save" : "Add"}
                        </Button>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Button
                            variant="outlined"
                            fullWidth
                            onClick={() => {
                                setId('');
                                setUsername('');
                                setPassword('');
                                setStatus('');
                            }}
                        >
                            Clear
                        </Button>
                    </Grid>                      
                </Box>
            </Paper>

        </Container>
    )
}