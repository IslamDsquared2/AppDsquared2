"use client"; 
import React,{useState,useRef} from 'react'
import * as XLSX from 'xlsx';
import { downloadTemplate } from '../Utils/DownloadTemplate'
import Header from '@/components/Header'
import {DownloadFile} from '../Utils/DownloadFile'
import { ToastContainer, toast } from 'react-toastify';

function Bullet() {
  const [xmlData, setXmlData] = useState(null);
  const fileInputRef = useRef(null);

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Assume il foglio di lavoro è nella prima posizione
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const startRow = 2; // E2 inizia da riga 2

        const xmlRecords = [];
        const xmlBulletRecords = [];
        const xmlCompositionRecords = [];
        let row = startRow;
        while (worksheet['A' + row]) {
          const productID = worksheet['A' + row]?.v || '';
          const xml = [
            worksheet['B' + row]?.v !== undefined ? ` <short-description xml:lang="default">${worksheet['B' + row]?.v}</short-description>` : '',
            worksheet['B' + row]?.v !== undefined ? ` <short-description xml:lang="en">${worksheet['B' + row]?.v}</short-description>` : '',
            worksheet['C' + row]?.v !== undefined ? ` <short-description xml:lang="it">${worksheet['C' + row]?.v}</short-description>` : '',
            worksheet['D' + row]?.v !== undefined ? ` <short-description xml:lang="fr">${worksheet['D' + row]?.v}</short-description>` : '',
            worksheet['E' + row]?.v !== undefined ? ` <short-description xml:lang="es">${worksheet['E' + row]?.v}</short-description>` : '',
            worksheet['F' + row]?.v !== undefined ? ` <short-description xml:lang="de">${worksheet['F' + row]?.v}</short-description>` : '',
            worksheet['G' + row]?.v !== undefined ? ` <short-description xml:lang="ru">${worksheet['G' + row]?.v}</short-description>` : '',
            worksheet['H' + row]?.v !== undefined ? ` <short-description xml:lang="ja">${worksheet['H' + row]?.v}</short-description>` : '',
            worksheet['I' + row]?.v !== undefined ? ` <short-description xml:lang="zh">${worksheet['I' + row]?.v}</short-description>` : ''
          ].join('');
          
          const xmlBullet = [
            worksheet['J' + row]?.v !== undefined ? ` <custom-attribute attribute-id="bullet" xml:lang="default">${worksheet['J' + row]?.v}</custom-attribute>` : '',
            worksheet['J' + row]?.v !== undefined ? ` <custom-attribute attribute-id="bullet" xml:lang="en">${worksheet['J' + row]?.v}</custom-attribute>` : '',
            worksheet['K' + row]?.v !== undefined ? ` <custom-attribute attribute-id="bullet" xml:lang="it">${worksheet['K' + row]?.v}</custom-attribute>` : '',
            worksheet['L' + row]?.v !== undefined ? ` <custom-attribute attribute-id="bullet" xml:lang="fr">${worksheet['L' + row]?.v}</custom-attribute>` : '',
            worksheet['M' + row]?.v !== undefined ? ` <custom-attribute attribute-id="bullet" xml:lang="es">${worksheet['M' + row]?.v}</custom-attribute>` : '',
            worksheet['N' + row]?.v !== undefined ? ` <custom-attribute attribute-id="bullet" xml:lang="de">${worksheet['N' + row]?.v}</custom-attribute>` : '',
            worksheet['O' + row]?.v !== undefined? `  <custom-attribute attribute-id="bullet" xml:lang="ru">${worksheet['O' + row]?.v}</custom-attribute>` : '',
            worksheet['P' + row]?.v !== undefined ? ` <custom-attribute attribute-id="bullet" xml:lang="ja">${worksheet['P' + row]?.v}</custom-attribute>` : '',
            worksheet['Q' + row]?.v !== undefined ? ` <custom-attribute attribute-id="bullet" xml:lang="zh">${worksheet['Q' + row]?.v}</custom-attribute>` : ''
          ].join('');
          
          const xmlComposition = [
            worksheet['R' + row]?.v !== undefined ? ` <custom-attribute attribute-id="composition" xml:lang="default">${worksheet['R' + row]?.v}</custom-attribute>` : '',
            worksheet['R' + row]?.v !== undefined ? ` <custom-attribute attribute-id="composition" xml:lang="en">${worksheet['R' + row]?.v}</custom-attribute>` : '',
            worksheet['S' + row]?.v !== undefined ? ` <custom-attribute attribute-id="composition" xml:lang="it">${worksheet['S' + row]?.v}</custom-attribute>` : '',
            worksheet['T' + row]?.v !== undefined ? ` <custom-attribute attribute-id="composition" xml:lang="fr">${worksheet['T' + row]?.v}</custom-attribute>` : '',
            worksheet['U' + row]?.v !== undefined ? ` <custom-attribute attribute-id="composition" xml:lang="es">${worksheet['U' + row]?.v}</custom-attribute>` : '',
            worksheet['V' + row]?.v !== undefined ? ` <custom-attribute attribute-id="composition" xml:lang="de">${worksheet['V' + row]?.v}</custom-attribute>` : '',
            worksheet['W' + row]?.v !== undefined? `  <custom-attribute attribute-id="composition" xml:lang="ru">${worksheet['W' + row]?.v}</custom-attribute>` : '',
            worksheet['X' + row]?.v !== undefined ? ` <custom-attribute attribute-id="composition" xml:lang="ja">${worksheet['X' + row]?.v}</custom-attribute>` : '',
            worksheet['Y' + row]?.v !== undefined ? ` <custom-attribute attribute-id="composition" xml:lang="zh">${worksheet['Y' + row]?.v}</custom-attribute>` : ''
          ].join('');
          
          row++;

         // Combina tutti i record XML
         const finalXml = `
             <product product-id=${productID}>
         ${xml}
         <custom-attributes>
         ${xmlBullet}
          ${xmlComposition}
         </custom attributes>
         </product>`;
          xmlRecords.push(finalXml);
        }
        const resultXML = `
        <?xml version="1.0" encoding="UTF-8"?>
        <catalog catalog-id="dsquared2-master-catalog" xmlns="http://www.demandware.com/xml/impex/catalog/2006-10-31">
        ${xmlRecords.join('')}
        </catalog>
        `;
        setXmlData(resultXML);
      }
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
      <span className='emojis'>🔫</span>
      <h2>Bullet Generator</h2>
      <p>Use this tool to generate bullet,descrition,composition, XML file to be imported on business manager.<br />
        Click <span className='download-underline' onClick={() => downloadTemplate('templateBullet')} >here</span> to download the template </p>
    <input type="file" id="select-file" className="select-file" accept=".xlsx" onChange={handleFileChange} style={{ display: 'none' }} />
      <label className='select-file-label cursor-pointer'  htmlFor="select-file" ref={fileInputRef} >UPLOAD YOUR EXCEL FILE </label>
       {/* Display xmlData here */}
       {xmlData && (
        <div>
          <button className='select-file-label downloaded' onClick={() => DownloadFile(xmlData,'BulletPoint-',true)}>
          <label className='cursor-pointer'  >DOWNLOAD FILE </label>
        </button>
        <p><a className="upload-und" href="/">Upload a new file</a></p>
        <ToastContainer />
        </div>
        )}
      </div>
    </>
  )
}

export default Bullet;