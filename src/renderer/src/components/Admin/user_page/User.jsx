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


export default function user(props){
    const [users, setUsers] = useState([]);

    useEffect(() => {
      fetchUserData();
    }, []);

    async function fetchUserData() {
        try {
          const data = await window.api.getUser();
          setUsers(data);
        } catch (err) {
          console.error(err);
        }
    }

    function handleToEdit(item) {
        console.log(item)
        props.setPage("edit_user");
    }

    function handleDelete(item) {
      console.log(item)

    }

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
                onClick={() => handleToEdit((params.row.id) -1)}
              >
                Edit
              </Button>
              <Button
                variant="contained"
                color="error"
                size="small"
                onClick={() => handleDelete((params.row.id) -1)}
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
        </Container>
    )
}