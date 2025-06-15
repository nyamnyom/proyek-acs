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

  if (!nota) return <>
        <Button variant='contained' color='error' onClick={() => navigate(-1)}>Back</Button>
        <p>Loading...</p>
  </>;

    async function printReport() {
        await window.api.printReport();
    }

  return (
    <div className="report-container">
      <div className="report-buttons no-print">
        <Button variant='contained' color='error' onClick={() => navigate(-1)}>Back</Button>
        <Button variant='contained' color='success' onClick={() => printReport()}>Print</Button>
      </div>
      <h2 className="report-title">Detail Nota Pembelian</h2>

      <div className="report-header">
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

      <table className="report-table">
        <thead>
          <tr>
            <th>Nama Barang</th>
            <th className="text-right">Harga Barang</th>
            <th className="text-right">Jumlah</th>
            <th className="text-right">Total Harga</th>
          </tr>
        </thead>
        <tbody>
          {details.map((item, index) => (
            <tr key={index}>
              <td>{item.nama_barang}</td>
              <td className="text-right">Rp {item.harga_barang}</td>
              <td className="text-right">{item.jumlah_barang}</td>
              <td className="text-right">Rp {item.total_harga}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="report-total">
        Total: Rp {nota.harga_total}
      </div>

      <div className="report-footer">
        Toko Kelontong Maju Jaya
      </div>
    </div>
  );
}