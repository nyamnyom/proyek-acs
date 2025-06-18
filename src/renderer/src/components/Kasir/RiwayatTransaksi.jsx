import React, { useEffect, useState } from 'react';
import { Box, Button, Container, Stack, Toolbar, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import NavbarKasir from './NavbarKasir';
import { DataGrid } from '@mui/x-data-grid';

export default function RiwayatTransaksi() {
  const [nota, setNota] = useState([]);
  const navigate = useNavigate();
      
  useEffect(() => {
    fetchNota();
  }, [])

  async function fetchNota(){
    try {
      const data = await window.api.getAllNota();
      setNota(data);
      console.log(data)
    } catch (err) {
      console.error(err);
    }
  }

  // const handleEdit = (row) => {
  //   // Implementasi edit jika diperlukan
  //   console.log('Edit nota:', row);
  // };
  
  //ke halaman detail nota
  const viewdetail = (idNota) => {
    navigate(`/kasir/detail-nota/${idNota}`);
  };

  const columns = [
    { field: "id_htrans", headerName: "ID Nota", flex: 1 },
    { 
      field: "harga_total", 
      headerName: "Total Pembelian", 
      type: 'number', 
      flex: 1,
      valueFormatter: (value) => {
        if (value == null) return '';
        return new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: 'IDR'
        }).format(value);
      }
    },
    {
      field: "created_at",
      headerName: "Tanggal Transaksi",
      flex: 1,
      valueFormatter: (value) => {
        if (value == null) return '';
        return new Date(value).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      }
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={2}>
          {/* <Button
            variant="contained"
            color="warning"
            size="small"
            onClick={() => handleEdit(params.row)}
          >
            Edit
          </Button> */}
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => viewdetail(params.row.id_htrans)}
          >
            View Detail
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
          <Box sx={{ height: 400, width: '100%' }}>
            <DataGrid
              rows={nota}
              columns={columns}
              getRowId={(row) => row.id_htrans}
              pageSizeOptions={[5, 10]}
              initialState={{
                pagination: { paginationModel: { page: 0, pageSize: 10 } },
              }}
              sx={{
                '& .MuiDataGrid-root': {
                  border: 'none',
                },
              }}
            />
          </Box>
        </Container>
      </Box>
    </Box>
  )
}