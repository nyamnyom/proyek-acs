import { useEffect, useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import '../../../../assets/reportPengiriman.css';
import { Button, Chip } from "@mui/material";

export function loaderPengirimanReport ({params}) {
    return params.idPengiriman;
}

export default function PengirimanReport () {
    const idPengiriman = useLoaderData();
    const [kirim, setKirim] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
        try {
            console.log(idPengiriman);
            const dataPengiriman = await window.api.getPengirimanById(idPengiriman);
            console.log(dataPengiriman)
            setKirim(dataPengiriman);
        } catch (err) {
            console.error("Gagal mengambil data:", err);
        }
        };

        if (idPengiriman) {
        fetchData();
        }
    }, [idPengiriman]);
    console.log(kirim);

    if (!kirim) return <>
        <Button variant='contained' color='error' onClick={() => navigate(-1)}>Back</Button>
        <p>Loading...</p>
    </>;

    async function printReport() {
        await window.api.printReport();
    }

    return(
        <div class="report-container">
            <div className="report-buttons no-print">
                <Button variant='contained' color='error' onClick={() => navigate(-1)}>Back</Button>
                <Button variant='contained' color='success' onClick={() => printReport()}>Print</Button>
            </div>
            <h2 class="report-title">Detail Pengiriman</h2>

            <div class="report-section">
            <div class="report-row">
                <span class="label">ID Order:</span>
                <span class="value"> {kirim.id}</span>
            </div>
            <div class="report-row">
                <span class="label">Nama Pembeli:</span>
                <span class="value"> {kirim.nama_pembeli}</span>
            </div>
            <div class="report-row">
                <span class="label">Nama Pengirim:</span>
                <span class="value"> {kirim.nama_pengirim}</span>
            </div>
            <div class="report-row">
                <span class="label">Total Pembelian:</span>
                <span class="value"> Rp {kirim.harga_total.toLocaleString('id-ID')}</span>
            </div>
            <div class="report-row">
                <span class="label">Status Pembayaran:</span>
                <span class="value"> {<Chip
                                                        label={kirim.status == "belum" ? "Belum Dikirim" : "Sudah Dikirim"}
                                                        color={kirim.status == "belum" ? "error" : "success"}
                                                        size="small"
                                                        variant="outlined"
                                                    />}</span>
            </div>
            <div class="report-footer">
                <span><strong>Tanggal:</strong> {new Date(kirim.created_at).toLocaleDateString('id-ID', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric'
                                            })}</span>
            </div>
            </div>
        </div>
    );
}