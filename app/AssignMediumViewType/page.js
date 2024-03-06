"use client";
import React, { useState, useRef, useEffect, useContext } from 'react'
import * as XLSX from 'xlsx';
import { downloadTemplate } from '../Utils/DownloadTemplate'
import Header from '../../components/Header'
import { useFileUpload } from '../Utils/UploadFiles';
import { DownloadFile } from '../Utils/DownloadFile'
import { ToastContainer, toast } from 'react-toastify';
import { LoadingContext } from '../Context/LoadingContext';
import useDragAndDrop from '../Utils/useDragAndDrop';
import { AvviaJob } from '../Utils/AvviaJob';



function AssignMediumViewType() {
  const [xmlData, setXmlData] = useState(null);
  const fileInputRef = useRef(null);
  const { isLoader, setIsLoader } = useContext(LoadingContext);
  const uploadFiles = useFileUpload();

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const startRow = 2; // Inizia dalla seconda riga

        const xmlRecords = [];

        let row = startRow;
        while (worksheet['A' + row]) {
          const productId = worksheet['A' + row]?.v || '';
          const variationValue = worksheet['B' + row]?.v || '';

          if (productId.trim() && variationValue.trim()) {
            xmlRecords.push(`
              <product product-id="${productId}">
                <images>
                  <image-group variation-value="${variationValue}" view-type="medium">
                    <image path="${productId}${variationValue}M.jpg"/>
                    <image path="${productId}${variationValue}B.jpg"/>
                  </image-group>
                </images>
              </product>
            `);
          }
          row++;
        }

        const resultXML = `<?xml version="1.0" encoding="UTF-8"?>
          <catalog catalog-id="dsquared2-master-catalog" xmlns="http://www.demandware.com/xml/impex/catalog/2006-10-31">
            ${xmlRecords.join('')}
          </catalog>
        `;
        setXmlData(resultXML);
      };

      reader.readAsArrayBuffer(file);

      if (fileInputRef.current) {
        toast.success('File uploaded successfully');
        fileInputRef.current.style.display = 'none';
      }
    }
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
        <div className='flex flex-col w-[100vw] h-[calc(100vh-90px)] justify-center items-center'>
          <span className='emojis'>📸</span>
          <h2>Assign Medium View Type Generator</h2>
          <p>Use this tool to generate the XML for the assign of the medium view type<br />
            Click <span className='download-underline' onClick={() => downloadTemplate('templateImage')} >here</span> to download the template </p>
          <input type="file" id="select-file" className="select-file" accept=".xlsx" onChange={handleFileChange} style={{ display: 'none' }} />
          <label className='select-file-label cursor-pointer' htmlFor="select-file" ref={fileInputRef} >UPLOAD/DROP YOUR EXCEL FILE </label>
          {/* Display xmlData here */}
          {xmlData && (
            <div>
              <button className='select-file-label downloaded m-2' onClick={() => DownloadFile(xmlData, 'AssignMediumViewType-', true)}>
                <label className='cursor-pointer'  >DOWNLOAD FILE </label>
              </button>
              <button className={` m-2 ${isLoader ? 'select-file-label-disabled' : 'select-file-label downloaded'}  `} onClick={() => uploadFiles('uploadMediumImage', xmlData)}>
                <label className='cursor-pointer'  > CARICA WEBDAV </label>
              </button>
              <button
                className={`m-2 ${isLoader ? 'select-file-label-disabled' : 'select-file-label downloaded'}`}
                onClick={() => {
                  setIsLoader(true);
                  AvviaJob('D2 - Catalog Import')
                    .then(() => {
                      toast.success('D2 - Catalog Import completed successfully');
                      setIsLoader(false);
                    })
                    .catch((error) => {
                      toast.error(`Error during D2 - Catalog Import: ${error.message}`);
                      setIsLoader(false);
                    });
                }}
              >
                Avvia Job
              </button>

              {/* <button className={` m-2 ${isLoader ? 'select-file-label-disabled' : 'select-file-label downloaded'}  `} onClick={() => uploadFiles('uploadVideoVimeo',xmlData)}>
            <label className='cursor-pointer'  > LAUNCH JOB </label>
          </button> */}
              {isLoader && (
                <div role="status" className="flex justify-center items-center">
                  <svg aria-hidden="true" className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-[#2ecc71]" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                  </svg>
                  <span className="sr-only">Loading...</span>
                </div>
              )}
              <p><a className="upload-und" href="/AssignMediumViewType">Upload a new file</a></p>
              <ToastContainer />
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default AssignMediumViewType;