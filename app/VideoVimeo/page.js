"use client";
import React, { useState, useRef, useContext } from 'react';
import * as XLSX from 'xlsx';
import { downloadTemplate } from '../Utils/DownloadTemplate';
import Header from '@/components/Header';
import { useFileUpload } from '../Utils/UploadFiles';
import { DownloadFile } from '../Utils/DownloadFile';
import { ToastContainer, toast } from 'react-toastify';
import { LoadingContext } from '../Context/LoadingContext';
import useDragAndDrop from '../Utils/useDragAndDrop';
import { AvviaJob } from '../Utils/AvviaJob';

function VideoVimeo() {
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
        const startRow = 2; // Prima riga contenente dati, inizia da 2 se 1 è l'intestazione

        // Crea un oggetto per memorizzare le associazioni
        const productData = {};

        let row = startRow;
        while (worksheet['A' + row]) {
          const productId = worksheet['A' + row]?.v || '';
          const v1OrV2 = worksheet['B' + row]?.v || '';
          const link = worksheet['C' + row]?.v || '';

          // Ignora righe vuote o incomplete
          if (!productId || !v1OrV2 || !link) {
            row++;
            continue;
          }

          // Se il prodotto non esiste ancora, inizializzalo
          if (!productData[productId]) {
            productData[productId] = { v1: null, v2: null };
          }

          // Aggiungi il link al prodotto corretto
          if (v1OrV2.endsWith('V1')) {
            productData[productId].v1 = link;
          } else if (v1OrV2.endsWith('V2')) {
            productData[productId].v2 = link;
          }

          row++;
        }

        // Genera l'XML
        const xmlRecords = Object.entries(productData).map(([productId, { v1, v2 }]) => `
          <product product-id="${productId}">
            <custom-attributes>
              ${v1 ? `<custom-attribute attribute-id="tileVideoUrl" xml:lang="x-default">https://player.vimeo.com/video/${v1}?color=ffffff&amp;controls=0&amp;autoplay=1&amp;loop=1</custom-attribute>` : ''}
              ${v2 ? `<custom-attribute attribute-id="videoUrl" xml:lang="x-default">https://player.vimeo.com/video/${v2}?color=ffffff&amp;controls=0&amp;autoplay=1&amp;loop=1</custom-attribute>` : ''}
            </custom-attributes>
          </product>
        `);

        const resultXML = `<?xml version="1.0" encoding="UTF-8"?>
          <catalog xmlns="http://www.demandware.com/xml/impex/catalog/2006-10-31" catalog-id="dsquared2-master-catalog">
            ${xmlRecords.join('')}
          </catalog>
        `;
        setXmlData(resultXML);
        toast.success('File elaborato con successo!');
      };

      reader.readAsArrayBuffer(file);

      if (fileInputRef.current) {
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
        className={`w-full h-full ${isDragActive ? 'drag-over' : ''}`}>
        <header>
          <Header />
        </header>
        <div className={`flex flex-col w-[100vw] h-[calc(100vh-90px)] justify-center items-center ${isDragActive ? 'drag-over' : ''}`}>
          <span className='emojis'>📹</span>
          <h2>Video Vimeo Generator</h2>
          <p>Usa questo strumento per generare l XML per i video in versione V1 e V2 <br />
            Clicca <span className='download-underline' onClick={() => downloadTemplate('templateVideoVimeo')} >qui</span> per scaricare il template. </p>
          <input type="file" id="select-file" className="select-file" accept=".xlsx" onChange={handleFileChange} style={{ display: 'none' }} />
          <label className='select-file-label cursor-pointer' htmlFor="select-file" ref={fileInputRef} >UPLOAD/DROP YOUR EXCEL FILE </label>
          {xmlData && (
            <div>
              <button className='select-file-label downloaded m-2' onClick={() => DownloadFile(xmlData, 'VideoVimeo-', true)}>
                <label className='cursor-pointer'>SCARICA FILE</label>
              </button>
              <button className={`m-2 ${isLoader ? 'select-file-label-disabled' : 'select-file-label downloaded'}`} onClick={() => uploadFiles('VideoVimeo', xmlData)}>
                <label className='cursor-pointer'>CARICA WEBDAV</label>
              </button>
              <button className={`m-2 ${isLoader ? 'select-file-label-disabled' : 'select-file-label downloaded'}`} onClick={() => {
                setIsLoader(true);
                AvviaJob('D2 - Catalog Import').then(() => {
                  toast.success('Importazione catalogo completata con successo!');
                  setIsLoader(false);
                }).catch((error) => {
                  toast.error(`Errore durante l'importazione: ${error.message}`);
                  setIsLoader(false);
                });
              }}>
                <label className='cursor-pointer'>AVVIA JOB IN STG</label>
              </button>
              {isLoader && (
                <div role="status" className="flex justify-center items-center">
                  <svg aria-hidden="true" className="w-8 h-8 mr-2 text-gray-200 animate-spin fill-[#2ecc71]" viewBox="0 0 100 101" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" />
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" />
                  </svg>
                  <span className="sr-only">Caricamento...</span>
                </div>
              )}
              <p><a className="upload-und" href="/Bullet">Carica un nuovo file</a></p>
              <ToastContainer />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default VideoVimeo;
