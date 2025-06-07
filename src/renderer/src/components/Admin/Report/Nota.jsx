import { useEffect, useState } from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';
import '../../../../assets/report.css';
import { Button } from '@mui/material';

export function loaderNotaReport ({params}) {
  return params.idNota;
}

export default function NotaReport () {
  const idNota = useLoaderData();
  const [nota, setNota] = useState(null);
  const [details, setDetails] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataNota = await window.api.getNotaById(idNota);
        console.log(dataNota)
        setNota(dataNota);
        const dataDetails = await window.api.getDetailNota(idNota);
        console.log(dataDetails)
        setDetails(dataDetails);
      } catch (err) {
        console.error("Gagal mengambil data:", err);
      }
    };

    if (idNota) {
      fetchData();
    }
  }, [idNota]);
  console.log(nota);

  if (!nota) return <p>Loading...</p>;


  return (
    <div className="nota-container">
      <div className="nota-buttons">
        <Button variant='contained' color='error' onClick={() => navigate(-1)}>Back</Button>
        <Button variant='contained' color='success' >Print</Button>
      </div>
      <h2 className="nota-title">Laporan Nota Pembelian</h2>

      <div className="nota-header">
        <div>
          <strong>ID Nota:</strong> {nota.id_htrans}
        </div>
        <div>
          <strong>Tanggal:</strong> {new Date(nota.created_at).toLocaleDateString('id-ID', {
                                      day: 'numeric',
                                      month: 'long',
                                      year: 'numeric'
                                    })}
        </div>
      </div>

      <table className="nota-table">
        <thead>
          <tr>
            <th>Nama Barang</th>
            <th>Harga Barang</th>
            <th>Jumlah</th>
            <th>Total Harga</th>
          </tr>
        </thead>
        <tbody>
          {details.map((item, index) => (
            <tr key={index}>
              <td>{item.nama_barang}</td>
              <td>Rp {item.harga_barang}</td>
              <td>{item.jumlah_barang}</td>
              <td>Rp {item.total_harga}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="nota-total">
        Total: Rp {nota.harga_total}
      </div>

      <div className="nota-footer">
        Terima kasih telah berbelanja.
      </div>
    </div>
  );
}