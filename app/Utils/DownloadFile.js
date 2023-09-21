import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function DownloadFile(xmlData, name, showToast = true) {
    if (xmlData) {
      const blob = new Blob([xmlData], { type: 'text/xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = name + new Date().toISOString() + '.xml';
      a.click();
      URL.revokeObjectURL(url);
  
      if (showToast) {
        toast.success('Download uploaded successfully');
      }
    }
  }