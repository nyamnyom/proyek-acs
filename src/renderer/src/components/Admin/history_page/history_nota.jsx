import { Box, Button, Container, Stack } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";

export default function HistoryNota() {
  const [nota, setNota] = useState([]);
      
      useEffect(() => {
          fetchNota();
      })
  
      async function fetchNota(){
          try {
            const data = await window.api.getNota();
            setNota(data);
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
                  onClick={() => handleDelete((params.row.id) )}
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
      );
}