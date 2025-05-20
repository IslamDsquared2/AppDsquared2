"use client";
import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import Header from '@/components/Header';
import useDragAndDrop from '../Utils/useDragAndDrop';
import { ToastContainer, toast } from 'react-toastify';

function CleanSpecialCharacters() {
    const [cleanedData, setCleanedData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [originalFileName, setOriginalFileName] = useState('');
    const fileInputRef = useRef(null);

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            setIsLoading(true);
            setOriginalFileName(file.name);
            const reader = new FileReader();
            reader.onload = function (e) {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const worksheet = workbook.Sheets[workbook.SheetNames[0]];

                // Clean all string values from \n and trim
                Object.keys(worksheet).forEach((cell) => {
                    if (cell[0] !== '!') {
                        const value = worksheet[cell].v;
                        if (typeof value === 'string') {
                            worksheet[cell].v = value.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
                        }
                    }
                });

                const cleanedWorkbook = XLSX.write(workbook, { bookType: 'xlsx', type: 'binary' });

                // Convert binary string to Blob
                function s2ab(s) {
                    const buf = new ArrayBuffer(s.length);
                    const view = new Uint8Array(buf);
                    for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
                    return buf;
                }

                const blob = new Blob([s2ab(cleanedWorkbook)], { type: "application/octet-stream" });
                setCleanedData(blob);
                setIsLoading(false);
                toast.success("File cleaned successfully");
            };
            reader.readAsArrayBuffer(file);
        }
    };

    const generateFileName = () => {
        // Get filename without extension
        const nameWithoutExt = originalFileName.replace(/\.[^/.]+$/, "");
        // Create timestamp in format YYYY-MM-DD-HH-MM-SS
        const now = new Date();
        const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}-${String(now.getHours()).padStart(2, '0')}-${String(now.getMinutes()).padStart(2, '0')}-${String(now.getSeconds()).padStart(2, '0')}`;
        
        return `${nameWithoutExt}_${timestamp}.xlsx`;
    };

    const downloadExcel = (blob) => {
        const fileName = generateFileName();
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

    const dragHandlers = cleanedData ? {} : {
        onDragEnter: handleDragEnter,
        onDragOver: handleDragOver,
        onDragLeave: handleDragLeave,
        onDrop: handleDrop
    };

    return (
        <>
        <div className="w-full h-full">
                <header>
                    <Header />
                </header>
        <div {...dragHandlers} className={`w-full h-full ${isDragActive ? 'drag-over' : ''}`}>

            <div className="flex flex-col w-full h-[calc(100vh-90px)] justify-center items-center">
                <span className='emojis'>🧹</span>
                <h2>Clean Special Characters</h2>
                <p>Upload or drop your Excel file to clean line breaks and excess spaces.</p>
                <input
                    type="file"
                    id="select-file"
                    className="hidden"
                    accept=".xlsx"
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

                {cleanedData && !isLoading && (
                    <button
                        className='select-file-label downloaded mt-4'
                        onClick={() => downloadExcel(cleanedData)}
                    >
                        <label className='cursor-pointer'>DOWNLOAD CLEANED FILE</label>
                    </button>
                )}

                <ToastContainer />
            </div>
        </div>
        </div>
        </>
    );
}

export default CleanSpecialCharacters;