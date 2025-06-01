import React, { use, useEffect, useState } from 'react';
import { Box, Button, Container, Stack, Toolbar, Typography } from '@mui/material';
import NavbarKasir from './NavbarKasir';
import { DataGrid } from '@mui/x-data-grid';

export default function RiwayatTransaksi() {
  const [nota, setNota] = useState([]);
      
      useEffect(() => {
          fetchNota();
      }, [])
  
      async function fetchNota(){
          try {
            const data = await window.api.getNota();
            setNota(data);
            console.log(data)
          } catch (err) {
            console.error(err);
          }
      }

      const columns = [
          { field: "id_htrans", headerName: "ID Nota", flex: 1 },
          { field: "harga_total", headerName: "Total Pembelian", type: 'number', flex: 1 },
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
                  onClick={() => handleDelete((params.row.id_htrans) )}
                >
                  Delete
                </Button>
              </Stack>
            ),
          },
      ];


    return ( 
        <Box sx={{ display: 'flex' }}>
            <NavbarKasir />
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <Toolbar />
                <Typography variant="h4" gutterBottom color="primary">
                Riwayat Transaksi
                </Typography>
            <Container>
                <Box sx={{ height: 300 }}>
                  <DataGrid
                    rows={nota}
                    columns={columns}
                    getRowId={(row) => row.id_htrans}
                    pageSizeOptions={[5, 10]}
                    initialState={{
                      pagination: { paginationModel: { page: 0, pageSize: 10 } },
                    }}
                  />
                </Box>
            </Container>
            </Box>
        </Box>
    )
}