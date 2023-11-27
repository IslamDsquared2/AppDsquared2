import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { LoadingContext } from '../Context/LoadingContext';
import { useContext } from "react";

export function useFileUpload() {
    const { setIsLoader } = useContext(LoadingContext);

    async function uploadFiles(url, xmlData) {
        setIsLoader(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${url}`, {
            method: "POST",
            body: JSON.stringify({ xmlData }),
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.ok) {
            toast.success("File caricato con successo");
            console.log("Dati inviati al server Node.js con successo");
        } else {
            toast.error("Errore durante il caricamento del file");
            console.error("Errore nell'invio dei dati");
        }
        setIsLoader(false);
    }

    return uploadFiles;
}
