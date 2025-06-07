import { Box, Button, Chip, Container, Stack } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";

export default function HistoryPengiriman() {
    const [kiriman, setKiriman] = useState([]);
    
    useEffect(() => {
        fetchKiriman();
    }, [])

    async function fetchKiriman(){
        try {
          const data = await window.api.getAllPengiriman();
          setKiriman(data);
          console.log(data)
        } catch (err) {
          console.error(err);
        }
    }

    const handleEdit = function(){
        
    }

    const handleDelete = function(){

    }

    const columns = [
        { field: "id_pengiriman", headerName: "ID Pengiriman", flex: 1 },
        { field: "nama_pembeli", headerName: "Nama Pembeli", flex: 1 },
        { field: "nama_pengirim", headerName: "Nama Pengirim", flex: 1 },
        { field: "harga_total", headerName: "Total Pembelian", type: 'number', flex: 1 },
        {
            field: "status",
            headerName: "Status Pembayaran",
            flex: 1,
            renderCell: (params) => {
                const bayar = params.value?.toLowerCase() === "sudah";
                return (
                <Chip
                    label={bayar ? "Sudah Bayar" : "Belum Bayar"}
                    color={bayar ? "success" : "error"}
                    size="small"
                    variant="outlined"
                />
                );
            },
        },
        {
          field: "actions",
          headerName: "Actions",
          flex: 1,
          renderCell: (params) => (
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                color="warning"
                size="small"
                onClick={() => handleEdit((params.row))}
              >
                Edit
              </Button>
              <Button
                variant="contained"
                color="error"
                size="small"
                onClick={() => handleDelete((params.row.id_pengiriman) )}
              >
                Delete
              </Button>
            </Stack>
          ),
        },
    ];

    return(
        <Container>
            <Box sx={{ height: 300 }}>
              <DataGrid
                rows={kiriman}
                columns={columns}
                getRowId={(row) => row.id_pengiriman}
                pageSizeOptions={[5, 10]}
                initialState={{
                  pagination: { paginationModel: { page: 0, pageSize: 10 } },
                }}
              />
            </Box>
        </Container>
    );
}