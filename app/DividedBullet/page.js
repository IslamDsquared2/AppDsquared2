"use client";
import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import Header from '@/components/Header';
import useDragAndDrop from '../Utils/useDragAndDrop';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Assicurati di importare gli stili
import JSZip from 'jszip';

function DividedBullet() {
    const [processedData, setProcessedData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [originalFileName, setOriginalFileName] = useState('');
    const [totalParts, setTotalParts] = useState(0);
    const fileInputRef = useRef(null);
    const MAX_ROWS_PER_FILE = 300;

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            setIsLoading(true);
            // Salva esplicitamente il nome del file
            const fileName = file.name;
            console.log("File originale caricato:", fileName); // Debug
            setOriginalFileName(fileName);
            
            // Usiamo setTimeout per assicurarci che lo state sia aggiornato
            setTimeout(() => {
                const reader = new FileReader();
            reader.onload = function (e) {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                
                // Convert to JSON
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: "" });
                
                // Get headers (first row)
                const headers = jsonData[0];
                
                // Calculate how many parts we need
                const dataRows = jsonData.slice(1); // Remove headers
                const parts = Math.ceil(dataRows.length / MAX_ROWS_PER_FILE);
                setTotalParts(parts);
                
                // Create zip file to hold all CSV files
                const zip = new JSZip();
                
                // Divide data into chunks and create CSV files
                for (let i = 0; i < parts; i++) {
                    const startIdx = i * MAX_ROWS_PER_FILE;
                    const endIdx = Math.min((i + 1) * MAX_ROWS_PER_FILE, dataRows.length);
                    const chunk = dataRows.slice(startIdx, endIdx);
                    
                    // Add headers back to each chunk
                    const chunkWithHeaders = [headers, ...chunk];
                    
                    // Convert chunk to worksheet
                    const chunkWorksheet = XLSX.utils.aoa_to_sheet(chunkWithHeaders);
                    
                    // Convert to CSV
                    const csvContent = XLSX.utils.sheet_to_csv(chunkWorksheet, { 
                        FS: ',',
                        blankrows: false,
                        strip: true
                    });
                    
                    // Add to zip
                    const partNumber = i + 1;
                    console.log("Nome file originale durante la creazione:", originalFileName); // Debug
                    const fileName = generatePartFileName(partNumber);
                    console.log(`Creando file parte ${partNumber}:`, fileName); // Debug
                    zip.file(fileName, csvContent);
                }
                
                // Generate ZIP file
                zip.generateAsync({ type: "blob" }).then(function(content) {
                    setProcessedData(content);
                    setIsLoading(false);
                    toast.success(`Excel file successfully split into ${parts} CSV files`, {
                        position: "bottom-center",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                        style: { fontSize: '14px' }
                    });
                });
            };
            
            reader.readAsArrayBuffer(file);
            }, 100); // Ritardo per assicurarsi che lo state sia aggiornato
        }
    };

    const generatePartFileName = (partNumber) => {
        // Approccio più robusto per ottenere il nome del file senza estensione
        const lastDotIndex = originalFileName.lastIndexOf('.');
        const nameWithoutExt = lastDotIndex !== -1 
            ? originalFileName.substring(0, lastDotIndex) 
            : originalFileName;
        
        console.log("Nome file senza estensione:", nameWithoutExt); // Debug
        return `${nameWithoutExt}_part_${partNumber}.csv`;
    };

    const generateZipFileName = () => {
        // Get filename without extension
        const nameWithoutExt = originalFileName.replace(/\.[^/.]+$/, "");
        // Create timestamp
        const now = new Date();
        const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}-${String(now.getHours()).padStart(2, '0')}-${String(now.getMinutes()).padStart(2, '0')}-${String(now.getSeconds()).padStart(2, '0')}`;
        
        return `${nameWithoutExt}_divided_${timestamp}.zip`;
    };

    const downloadFiles = (blob) => {
        const fileName = generateZipFileName();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    };

    const {
        isDragActive,
        handleDragEnter,
        handleDragLeave,
        handleDragOver,
        handleDrop,
    } = useDragAndDrop(handleFileChange);

    const dragHandlers = processedData ? {} : {
        onDragEnter: handleDragEnter,
        onDragOver: handleDragOver,
        onDragLeave: handleDragLeave,
        onDrop: handleDrop
    };

    return (
        <div {...dragHandlers} className={`w-full h-full ${isDragActive ? 'drag-over' : ''}`}>
            <Header />
            <div className="flex flex-col w-full h-[calc(100vh-90px)] justify-center items-center">
                <span className='emojis'>📊</span>
                <h2>Divide Excel into CSV Files</h2>
                <p>Upload or drop your Excel file to split it into multiple CSV files (max 300 rows each).</p>
                <input
                    type="file"
                    id="select-file"
                    className="hidden"
                    accept=".xlsx,.xls"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                />
                <label
                    htmlFor="select-file"
                    className='select-file-label cursor-pointer'
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                >
                    UPLOAD / DROP YOUR EXCEL FILE
                </label>

                {isLoading && (
                    <div role="status" className="mt-4">
                        <svg aria-hidden="true" className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-[#2ecc71]" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                        </svg>
                        <span className="sr-only">Loading...</span>
                    </div>
                )}

                {processedData && !isLoading && (
                    <div className="flex flex-col items-center mt-4">
                        <p className="text-center mb-2">
                            File has been split into {totalParts} CSV files with max {MAX_ROWS_PER_FILE} rows each
                        </p>
                        <button
                            className='select-file-label downloaded'
                            onClick={() => downloadFiles(processedData)}
                        >
                            <label className='cursor-pointer'>DOWNLOAD CSV FILES (ZIP)</label>
                        </button>
                    </div>
                )}

                <ToastContainer 
                    position="bottom-center"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                    style={{ fontSize: '14px' }}
                />
            </div>
        </div>
    );
}

export default DividedBullet;