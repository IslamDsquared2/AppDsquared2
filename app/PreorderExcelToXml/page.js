"use client"; 

import React, { useState, useRef,useContext } from 'react';
import * as XLSX from 'xlsx';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from '@/components/Header';
import { useFileUpload } from '../Utils/UploadFiles';
import { downloadTemplate } from '../Utils/DownloadTemplate';
import {DownloadFile} from '../Utils/DownloadFile';
import { LoadingContext } from '../Context/LoadingContext';
import useDragAndDrop from '../Utils/useDragAndDrop';


function ExcelToXmlConverter() {
  const [xmlData, setXmlData] = useState(null);
  const uploadFiles = useFileUpload(); 
  const fileInputRef = useRef(null);
  const { isLoader, setIsLoader } = useContext(LoadingContext);

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        // Assume il foglio di lavoro è nella prima posizione
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];

        // Righe e colonne da cui iniziare l'estrazione dei dati
        const startRow = 2; // E2 inizia da riga 2

        const xmlRecords = [];

        // Scorrere le righe e colonne per estrarre i dati
        let row = startRow;
        while (worksheet['D' + row]) {
          const productID = worksheet['A' + row]?.v || '';
          const size = worksheet['B' + row]?.v || '';

          const allocation = 0;
          const allocationTimestamp = new Date().toISOString();
          const perpetual = false;
          const preorderBackorderHandling = 'preorder';
          const dateStr = worksheet['D' + row]?.w; // Assumi che il formato sia "YYYY-MM-DD"
          const parts = dateStr ? dateStr.split('-') : [];
          const year = parseInt(parts[0]);
          const month = parseInt(parts[1]) - 1; // Mese è 0-based
          const day = parseInt(parts[2]);
          const inStockDateTime = dateStr ? new Date(year, month, day).toISOString() : '';
          //instockDate è uguale a datetime ma senza tempo
          const inStockDate = dateStr ? new Date(year, month, day).toISOString().split('T')[0] : '';
          const ats = worksheet['C' + row]?.v || 0;
          const onOrder = 0;
          const turnover = 0;

          // Genera il documento XML per questa riga
          const xml = `
            <record product-id="${productID}${size} ">
              <allocation>${allocation}</allocation>
              <allocation-timestamp>${allocationTimestamp}</allocation-timestamp>
              <perpetual>${perpetual}</perpetual>
              <preorder-backorder-handling>${preorderBackorderHandling}</preorder-backorder-handling>
              <preorder-backorder-allocation>${ats}</preorder-backorder-allocation>
              <in-stock-date>${inStockDate}</in-stock-date>
              <in-stock-datetime>${inStockDateTime}</in-stock-datetime>
              <ats>${ats}</ats>
              <on-order>${onOrder}</on-order>
              <turnover>${turnover}</turnover>
            </record>
          `;

          xmlRecords.push(xml);

          row++;
        }

        // Combina tutti i record XML
        const finalXml = `
        <?xml version="1.0" encoding="UTF-8"?>
        <inventory xmlns="http://www.demandware.com/xml/impex/inventory/2007-05-31">
        <inventory-list>
        <header list-id="dsquared2-inventory">
        <default-instock>false</default-instock>
        <use-bundle-inventory-only>false</use-bundle-inventory-only>
        <on-order>true</on-order>
        </header>
        <records>
        ${xmlRecords.join('')}
        </records>
        </inventory-list>
        </inventory>`;
        setXmlData(finalXml);
      };

      reader.readAsArrayBuffer(file);
    }
    //react notify notifica success
   
  };
  if (fileInputRef.current) {
    toast.success('File uploaded successfully');
    fileInputRef.current.style.display = 'none';
  }

  const {
    isDragActive,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
} = useDragAndDrop(handleFileChange);

const dragHandlers = xmlData ? {} : {
    onDragEnter: handleDragEnter,
    onDragOver: handleDragOver,
    onDragLeave: handleDragLeave,
    onDrop: handleDrop
};

  return (
    <>
    <div {...dragHandlers}
                className="w-full h-full"
            >
    <header>
        <Header />
      </header>
    <div className='preorder'>
      <span className='emojis'>🧇</span>
      <h2>Preorder XML Generator</h2>
      <p>Use this tool to generate preorder XML file to be imported on business manager.<br />

        Click <span className='download-underline' onClick={() => downloadTemplate('templatePreorder')} >here</span> to download the template </p>

      <input type="file" id="select-file" className="select-file" accept=".xlsx" onChange={handleFileChange} style={{ display: 'none' }} />
      <label className='select-file-label cursor-pointer' ref={fileInputRef} htmlFor="select-file">UPLOAD/DROP YOUR EXCEL FILE </label>

      

      {xmlData && (
        <div>
          <div>
            <button className='select-file-label downloaded m-2' onClick={() => DownloadFile(xmlData,'PreorderXml-',true)}>
              <label className='cursor-pointer'  >DOWNLOAD FILE </label>
              <ToastContainer />
            </button>
            <button className={` m-2 ${isLoader ? 'select-file-label-disabled' : 'select-file-label downloaded'}  `} onClick={() => uploadFiles('uploadPreorder',xmlData)}>
            <label className='cursor-pointer'  > CARICA WEBDAV </label>
          </button>
          {isLoader && (
                            <div role="status" className="flex justify-center items-center">
                                <svg aria-hidden="true" className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-[#2ecc71]" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                </svg>
                                <span className="sr-only">Loading...</span>
                            </div>
                        )}
            <p><a className="upload-und" href="/PreorderExcelToXml">Upload a new file</a></p>
          </div>
        </div>
      )}
    </div>
    </div>
    </>
  );
}

export default ExcelToXmlConverter;