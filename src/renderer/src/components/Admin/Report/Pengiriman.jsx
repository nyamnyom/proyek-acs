import { useLoaderData } from "react-router-dom";

export function loaderPengirimanReport ({params}) {
    return params.idPengiriman;
}

export default function PengirimanReport () {
    const idPengiriman = useLoaderData();
    
}