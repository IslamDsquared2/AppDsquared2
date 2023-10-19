"use client";
import React, { useState, useRef } from 'react'
import * as XLSX from 'xlsx';
import { downloadTemplate } from '../Utils/DownloadTemplate'
import Header from '@/components/Header'
import { DownloadFile } from '../Utils/DownloadFile'
import { ToastContainer, toast } from 'react-toastify';
import { UploadFiles } from '../Utils/UploadFiles';


function Recommendation() {
    const fileInputRef = useRef(null);
    const [xmlData, setXmlData] = useState(null);

    function handleFileChange(event) {
        const file = event.target.files[0];
    
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
    
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
    
                const rows = XLSX.utils.sheet_to_json(worksheet, {header: 1});
    
                let xmlString = '<?xml version="1.0" encoding="UTF-8"?> <catalog xmlns="http://www.demandware.com/xml/impex/catalog/2006-10-31" catalog-id="dsquared2-storefront-catalog">\n'; 
    
                // Starting from the second row (index 1)
                for (let i = 1; i < rows.length; i++) {
                    const skuPrincipale = rows[i][0];
                    const skuCorrelata = rows[i][1];
    
                    if (skuPrincipale && skuCorrelata) {
                        xmlString += `<recommendation source-id="${skuPrincipale}" source-type="product" target-id="${skuCorrelata}" type="1"/>\n`;
                    }
                }

                xmlString += '</catalog>';
                setXmlData(xmlString);
    
                // Here, you can further process the xmlString or save it to a file.
            };
    
            reader.readAsArrayBuffer(file);
            if (fileInputRef.current) {
                toast.success('File uploaded successfully');
                fileInputRef.current.style.display = 'none';
          
              }
        }
    }
 



  return (
    <>
    <header>
      <Header />
    </header>
    <div className='flex flex-col w-[100vw] h-[calc(100vh-90px)] justify-center items-center'>
      <span className='emojis'>✍🏽</span>
      <h2>Recommendation XML Generator</h2>
      <p>Use this tool to generate recommendation,descrition,composition, XML file to be imported on business manager.<br />
        Click <span className='download-underline' onClick={() => downloadTemplate('templateRecommendation')} >here</span> to download the template </p>
      <input type="file" id="select-file" className="select-file" accept=".xlsx" onChange={handleFileChange} style={{ display: 'none' }} />
      <label className='select-file-label cursor-pointer' htmlFor="select-file" ref={fileInputRef} >UPLOAD YOUR EXCEL FILE </label>
      {/* Display xmlData here */}
      {xmlData && (
        <div>
          <button className='select-file-label downloaded m-2' onClick={() => DownloadFile(xmlData, 'Recommendation-', true)}>
            <label className='cursor-pointer'  >DOWNLOAD FILE </label>
          </button>
          <button className='select-file-label downloaded m-2' onClick={() => UploadFiles('uploadRecommendation',xmlData)}>
            <label className='cursor-pointer'  > CARICA WEBDAV </label>
          </button>
          <p><a className="upload-und" href="/">Upload a new file</a></p>
          <ToastContainer />
        </div>
      )}
    </div>
  </>
  )
}

export default Recommendation