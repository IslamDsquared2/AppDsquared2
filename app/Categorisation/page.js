"use client";
import React, { useState, useRef, useContext } from 'react';
import { downloadTemplate } from '../Utils/DownloadTemplate';
import { DownloadFile } from '../Utils/DownloadFile';
import Header from '@/components/Header';
import { useFileUpload } from '../Utils/UploadFiles';
import { ToastContainer, toast } from 'react-toastify';
import { LoadingContext } from '../Context/LoadingContext';
import * as XLSX from 'xlsx';
import useDragAndDrop from '../Utils/useDragAndDrop';
import { AvviaJob } from '../Utils/AvviaJob';


function Categorisation() {
    const [xmlData, setXmlData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef(null);
    const { isLoader, setIsLoader } = useContext(LoadingContext);
    const uploadFiles = useFileUpload();
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

    function findParentCategory(categoryId, worksheet) {
        // Assuming column A has categoryIDs and column B has parentIDs.
        const categoryColumn = "A";
        const parentColumn = "B";

        // Find the max row number in the worksheet
        const maxRow = worksheet['!ref'].split(":")[1].replace(/[A-Z]/g, '');

        for (let i = 1; i <= maxRow; i++) {
            const categoryCell = `${categoryColumn}${i}`;
            const parentCell = `${parentColumn}${i}`;

            if (worksheet[categoryCell] && worksheet[categoryCell].v === categoryId) {
                return worksheet[parentCell] ? worksheet[parentCell].v : null;
            }
        }

        return null;  // No parent found
    }

    async function handleFileChange(event) {
        console.log(event)
        const file = event.target.files[0];

        if (file) {
            setIsLoading(true);
            const reader = new FileReader();
            reader.onload = async function (e) {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });

                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];

                const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

                let xmlString = '<?xml version="1.0" encoding="UTF-8"?> <catalog xmlns="http://www.demandware.com/xml/impex/catalog/2006-10-31" catalog-id="dsquared2-storefront-catalog">\n';

                // Starting from the second row (index 1)
                for (let i = 1; i < rows.length; i++) {
                    const sku = rows[i][0];

                    for (let col = 1; col <= 4; col++) { // Qui definiamo il ciclo dalle colonne B (1) a E (4)
                        const categoryId = rows[i][col];

                        if (categoryId && sku) {
                            // Condizione per inserire il tag <primary-flag> solo per la colonna B
                            if (col === 1) {
                                xmlString += `
                                <category-assignment category-id="${categoryId}" product-id="${sku}">\n
                                <primary-flag>true</primary-flag>
                                </category-assignment>
                                `;
                            } else {
                                xmlString += `
                                <category-assignment category-id="${categoryId}" product-id="${sku}"></category-assignment>
                                `;
                            }

                            try {
                                const response = await fetch('/categoryParent.xlsx');
                                const arrayBuffer = await response.arrayBuffer();
                                const data = new Uint8Array(arrayBuffer);
                                const workbook = XLSX.read(data, { type: 'array' });

                                const firstSheetName = workbook.SheetNames[0];
                                const worksheet = workbook.Sheets[firstSheetName];

                                let categoryToCheck = categoryId;
                                while (categoryToCheck && categoryToCheck !== "root") {
                                    const parentCategory = findParentCategory(categoryToCheck, worksheet);

                                    if (parentCategory && parentCategory !== "root") {
                                        xmlString += `
                                        <category-assignment category-id="${parentCategory}" product-id="${sku}"></category-assignment>
                                        `;
                                    }

                                    categoryToCheck = parentCategory;
                                }
                                xmlString += '\n';

                            } catch (error) {
                                console.error("Errore nel caricamento del file Excel:", error);
                            }
                        }
                    }
                }


                xmlString += '</catalog>';
                setXmlData(xmlString);
                setIsLoading(false);

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
            <div {...dragHandlers}
        className={`w-full h-full ${isDragActive ? 'drag-over' : ''}`}
        >
                <header>
                    <Header />
                </header>
                <div className={`flex flex-col w-[100vw] h-[calc(100vh-90px)] justify-center items-center ${isDragActive ? 'drag-over' : ''}`}>
                    <span className='emojis'>📌</span>
                    <h2>Categorisation XML Generator</h2>
                    <p>Use this tool to categorize product, XML file to be imported on business manager.<br />
                        Click <span className='download-underline' onClick={() => downloadTemplate('templateCategorisation')} >here</span> to download the template </p>
                    <input type="file" id="select-file" className="select-file" accept=".xlsx" onChange={handleFileChange} style={{ display: 'none' }} />
                    <label className='select-file-label cursor-pointer' htmlFor="select-file" draggable="true"
                        onDragEnter={handleDragEnter}
                        onDragLeave={handleDragLeave}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop} ref={fileInputRef} >UPLOAD/DROP YOUR EXCEL FILE </label>
                    {/* Display xmlData here */}
                    {isLoading && (
                        <div role="status">
                            <svg aria-hidden="true" className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-[#2ecc71]" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                            </svg>
                            <span className="sr-only">Loading...</span>
                        </div>
                    )}
                    {xmlData && (
                        <div>
                            <button className='select-file-label downloaded m-2' onClick={() => DownloadFile(xmlData, 'Categorisation-', true)}>
                                <label className='cursor-pointer'  >DOWNLOAD FILE </label>
                            </button>
                            <button className={` m-2 ${isLoader ? 'select-file-label-disabled' : 'select-file-label downloaded'}  `} onClick={() => uploadFiles('uploadCategorisation', xmlData)}>
                                <label className={`cursor-pointer `}  > CARICA WEBDAV </label>
                            </button>
                            <button className={` m-2 ${isLoader ? 'select-file-label-disabled' : 'select-file-label downloaded'}  `} onClick={() => {setIsLoader(true); AvviaJob('D2 - Catalog Import').then(() => {
                                toast.success('D2 - Catalog Import completed successfully');
                                setIsLoader(false);
                            })
                                .catch((error) => {
                                    toast.error(`Error during D2 - Catalog Import: ${error.message}`);
                                    setIsLoader(false);
                                })}}>
                                <label className='cursor-pointer'  >AVVIA JOB IN STG</label>
                            </button>

                            {isLoader && (
                                <div role="status" className="flex justify-center items-center">
                                    <svg aria-hidden="true" className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-[#2ecc71]" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                    </svg>
                                    <span className="sr-only">Loading...</span>
                                </div>
                            )
                            }
                            <p><a className="upload-und" href="/Categorisation">Upload a new file</a></p>
                            <ToastContainer />
                        </div>
                    )}
                </div>
            </div>

        </>
    )
}

export default Categorisation