"use client"; 

import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from '@/components/Header';
import { downloadTemplate } from '../Utils/DownloadTemplate';
import {DownloadFile} from '../Utils/DownloadFile';
import { UploadFiles } from '../Utils/UploadFiles';

function ExcelToXmlConverter() {
  const [xmlData, setXmlData] = useState(null);
  const fileInputRef = useRef(null);

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

  return (
    <>
    <header>
        <Header />
      </header>
    <div className='preorder'>
      <span className='emojis'>🧇</span>
      <h2>Preorder XML Generator</h2>
      <p>Use this tool to generate preorder XML file to be imported on business manager.<br />

        Click <span className='download-underline' onClick={() => downloadTemplate('templatePreorder')} >here</span> to download the template </p>

      <input type="file" id="select-file" className="select-file" accept=".xlsx" onChange={handleFileChange} style={{ display: 'none' }} />
      <label className='select-file-label cursor-pointer' ref={fileInputRef} htmlFor="select-file">UPLOAD YOUR EXCEL FILE </label>

      

      {xmlData && (
        <div>
          <div>
            <button className='select-file-label downloaded m-2' onClick={() => DownloadFile(xmlData,'PreorderXml-',true)}>
              <label className='cursor-pointer'  >DOWNLOAD FILE </label>
              <ToastContainer />
            </button>
            <button className='select-file-label downloaded m-2' onClick={() => UploadFiles('uploadPreorder',xmlData)}>
            <label className='cursor-pointer'  > CARICA WEBDAV </label>
          </button>
            <p><a className="upload-und" href="/">Upload a new file</a></p>
          </div>
        </div>
      )}
    </div>
    </>
  );
}

export default ExcelToXmlConverter;