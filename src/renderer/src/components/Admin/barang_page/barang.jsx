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


export default function barang(){
    //Data Tabel
    const [barang, setBarang] = useState([]);

    //Data Form
    const [id, setId] = useState("");
    const [namaBarang, setNamaBarang] = useState("");
    const [harga, setHarga] = useState(0);
    const [stok, setStok] = useState(0);

    useEffect(() => {
      fetchBarangData();
    }, []);

    async function fetchBarangData() {
        try {
          const data = await window.api.getBarang();
          setBarang(data);
          console.log(data)
        } catch (err) {
          console.error(err);
        }
    }

    async function handleToEdit(item) {
      console.log(item)
      setId(item.id)
      setNamaBarang(item.nama)
      setHarga(item.harga)
      setStok(item.stok)
    }

    async function handleDelete(item_id) { 
      console.log("Deleting ID:", item_id);
      const result = await window.api.deleteBarang(item_id);
      if (result.success) {
        alert("Barang deleted successfully");
        fetchBarangData();
      } else {
        alert(`Error: ${result.message}`);
      }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (id == "") {
            const result = await window.api.insertBarang(
              namaBarang,
              harga,
              stok,
            );
      
            if (result.success) {
              alert("Barang added successfully");
              setId("");
              setNamaBarang('');
              setHarga('');
              setStok('');
              fetchBarangData();
            } else {
              alert(`Error: ${result.message}`);
            }
        } else {
            const result = await window.api.editBarang(
              harga,
              stok,
              id
            );
            if (result.success) {
              alert("Barang edited ");
              setId("");
              setNamaBarang('');
              setHarga('');
              setStok('');
              fetchBarangData();
            } else {
              setId("");
              setNamaBarang('');
              setHarga('');
              setStok('');
              fetchBarangData();
              alert(`Error: ${result.message}`);
            }
        } 
    };

    const barangColumns = [
        { field: "id", headerName: "Id Barang", flex: 1 },
        { field: "nama", headerName: "Nama Barang", flex: 1 },
        { field: "harga", headerName: "Harga", flex: 1 },
        { field: "stok", headerName: "Stok", flex: 1 },
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
                Manajemen Barang
            </Typography>

            {/* Section: Tabel Barang */}
            <Box sx={{ height: 300 }}>
              <DataGrid
                rows={barang}
                columns={barangColumns}
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
                            label="Nama Barang"
                            value={namaBarang}
                            onChange={(e) => setNamaBarang(e.target.value)}
                            size="small"
                            disabled={id !== ""}
                        />
                    </Grid>
                    <Grid item xs={12} >
                        <TextField
                            fullWidth
                            required
                            label="Harga"
                            type="number"
                            value={harga}
                            inputProps={{ min: 0 }} 
                            onChange={(e) => setHarga(e.target.value)}
                            size="small"
                        />
                    </Grid>
                    <Grid item xs={12} >
                        <TextField
                            fullWidth
                            required
                            label="Stock"
                            type="number"
                            value={stok}
                            inputProps={{ min: 0 }} 
                            onChange={(e) => setStok(e.target.value)}
                            size="small"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            disabled={!namaBarang || !harga || !stok}
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
                                setNamaBarang('');
                                setHarga('');
                                setStok('');
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