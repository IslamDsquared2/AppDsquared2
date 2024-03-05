// utils.js
import { toast } from 'react-toastify';
import { LoadingContext } from '../Context/LoadingContext';


/**
 * Funzione per avviare un job specifico tramite una richiesta HTTP POST.
 * @param {string} jobID L'ID del job da avviare.
 * @returns {Promise} Una promise che si risolve con i dati della risposta o un errore.
 */
export const AvviaJob = (jobID) => {
    return fetch(`${process.env.NEXT_PUBLIC_API_URL}/getJob`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jobID }),
    })
    .then(response => {
        if (!response.ok) {
            toast.error('Network response was not ok');
            throw new Error('Network response was not ok');
        }
        toast.success('Job launched successfully');
        return response.json();
      
    })
    .catch(error => {
        toast.error('Errore: ' + error.message);
        console.error('Errore:', error);
        throw error; // Allows further error handling
    });
};
