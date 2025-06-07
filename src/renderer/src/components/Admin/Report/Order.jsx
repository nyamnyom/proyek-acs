import { useLoaderData } from "react-router-dom"

export function loaderOrderReport ({params}) {
    return params.idOrder
}

export default function OrderReport () {
    const idOrder = useLoaderData();
}