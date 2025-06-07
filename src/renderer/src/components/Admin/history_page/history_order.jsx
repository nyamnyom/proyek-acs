import { Box, Button, Chip, Container, Stack } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function HistoryOrder() {
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchOrder();
    }, [])

    async function fetchOrder(){
        try {
          const data = await window.api.getAllOrder();
          setOrders(data);
          console.log(data)
        } catch (err) {
          console.error(err);
        }
    }

    const handleView = function(idOrder){
        navigate("/admin/nota-report", {replace: true});
    }

    const columns = [
        { field: "id", headerName: "Order ID", flex: 1 },
        { field: "nama_pembeli", headerName: "Nama Pembeli", flex: 1 },
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
                color="primary"
                onClick={() => handleView((params.row.id))}
              >
                View Details
              </Button>
            </Stack>
          ),
        },
    ];

    return(
        <Container>
            <Box sx={{ height: 300 }}>
              <DataGrid
                rows={orders}
                columns={columns}
                getRowId={(row) => row.id}
                pageSizeOptions={[5, 10]}
                initialState={{
                  pagination: { paginationModel: { page: 0, pageSize: 10 } },
                }}
              />
            </Box>
        </Container>
    );
}