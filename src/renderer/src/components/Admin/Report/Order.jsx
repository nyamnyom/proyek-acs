import { useEffect, useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom"
import '../../../../assets/report.css';
import { Button, Chip } from "@mui/material";

export function loaderOrderReport ({params}) {
    return params.idOrder;
}

export default function OrderReport () {
    const idOrder = useLoaderData();
    const [order, setOrder] = useState(null);
    const [details, setDetails] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
        try {
            const dataOrder = await window.api.getOrderByIdAdmin(idOrder);
            console.log(dataOrder)
            setOrder(dataOrder);
            const dataDetails = await window.api.getDetailOrder(idOrder);
            console.log(dataDetails)
            setDetails(dataDetails);
        } catch (err) {
            console.error("Gagal mengambil data:", err);
        }
        };

        if (idOrder) {
        fetchData();
        }
    }, [idOrder]);
    console.log(order);

    if (!order) return <>
        <Button variant='contained' color='error' onClick={() => navigate(-1)}>Back</Button>
        <p>Loading...</p>
    </>;

    async function printReport() {
        await window.api.printReport();
    }

    return(
        <div className="report-container">
            <div className="report-buttons no-print">
                <Button variant='contained' color='error' onClick={() => navigate(-1)}>Back</Button>
                <Button variant='contained' color='success' onClick={() => printReport()}>Print</Button>
            </div>
            <h2 className="report-title">Detail Order</h2>

            <div className="report-header">
                <div className="header-content">
                    <strong>ID Order:</strong> {order.id}
                </div>
                <div className="header-content">
                    <strong>Nama Pembeli:</strong> {order.nama_pembeli}
                </div>
                <div className="header-content">
                    <strong>Tanggal Order:</strong> {new Date(order.created_at).toLocaleDateString('id-ID', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric'
                                            })}
                </div>
                <div className="header-content">
                    <strong>Status Terkirim:</strong> {<Chip
                                                            label={order.status == "belum" ? "Belum Dikirim" : "Sudah Dikirim"}
                                                            color={order.status == "belum" ? "error" : "success"}
                                                            size="small"
                                                            variant="outlined"
                                                        />}
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
                Total: Rp {order.harga_total}
            </div>

            <div className="report-footer">
                Toko Kelontong Maju Jaya
            </div>
        </div>
    );
}