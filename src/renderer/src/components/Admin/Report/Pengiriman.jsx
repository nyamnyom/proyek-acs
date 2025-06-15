import { useLoaderData } from "react-router-dom";

export function loaderPengirimanReport ({params}) {
    return params.idPengiriman;
}

export default function PengirimanReport () {
    const idPengiriman = useLoaderData();
    const [kirim, setKirim] = useState(null);
    const [details, setDetails] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
        try {
            const dataNota = await window.api.getOrderByIdAdmin(idOrder);
            console.log(dataNota)
            setKirim(dataNota);
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
    console.log(kirim);

    if (!kirim) return <p>Loading...</p>;

    return(
        <div className="report-container">
            <div className="report-buttons">
                <Button variant='contained' color='error' onClick={() => navigate(-1)}>Back</Button>
                <Button variant='contained' color='success' >Print</Button>
            </div>
            <h2 className="report-title">Detail Order</h2>

            <div className="report-header">
                <div className="header-content">
                    <strong>ID Order:</strong> {kirim.id}
                </div>
                <div className="header-content">
                    <strong>Nama Pembeli:</strong> {kirim.nama_pembeli}
                </div>
                <div className="header-content">
                    <strong>Tanggal Order:</strong> {new Date(kirim.created_at).toLocaleDateString('id-ID', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric'
                                            })}
                </div>
                <div className="header-content">
                    <strong>Status Terkirim:</strong> {<Chip
                                                            label={kirim.status == "belum" ? "Belum Dikirim" : "Sudah Dikirim"}
                                                            color={kirim.status == "belum" ? "error" : "success"}
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
                Total: Rp {kirim.harga_total}
            </div>

            <div className="report-footer">
                Toko Kelontong Maju Jaya
            </div>
        </div>
    );
}