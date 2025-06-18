import { Box, Button, Container, Stack } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function HistoryNota(props) {
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

      const handleView = function(idNota) {
        navigate(`/admin/nota-report/${idNota}`);
      }
  
      const columns = [
          { 
              field: "created_at",
              headerName: "Tanggal Nota",
              flex: 1,
              renderCell: (params) => {
                return new Date(params.value).toLocaleDateString('id-ID', {
                                              day: 'numeric',
                                              month: 'long',
                                              year: 'numeric'
                                              })
              }
          },
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
                  color="primary"
                  onClick={() => handleView((params.row.id_htrans))}
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
                  rows={nota}
                  columns={columns}
                  getRowId={(row) => row.id_htrans}
                  pageSizeOptions={[5, 10]}
                  initialState={{
                    pagination: { paginationModel: { page: 0, pageSize: 10 } },
                  }}
                />
              </Box>
              <Button onClick={() => props.setPage("report_nota")}>Report</Button>
          </Container>
      );
}