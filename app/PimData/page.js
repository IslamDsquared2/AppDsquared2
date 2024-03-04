"use client";
import React, { useState, useRef, useEffect, useContext } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import { AvviaJob } from '../Utils/AvviaJob';
import Header from '@/components/Header';



function PimData() {

    function PimDataJobLaunch() {
        AvviaJob('1-Akeneo-Import-Attributes');
        setTimeout(() => {
            AvviaJob('3-1-1-Akeneo-Differential-Import-Master');
        }, 30000);
    }


    return (
        <>
            <div className="w-full h-full">
                <header>
                    <Header />
                </header>
                <div className='flex flex-col w-[100vw] h-[calc(100vh-90px)] justify-center items-center'>
                    <span className='emojis'>🤡</span>
                    <h2>Import PIM Data</h2>
                    <p>Launch the job for the PIM Update it takes 30s from a job to another one</p>
                    <button className={` m-2  select-file-label downloaded`} onClick={() => PimDataJobLaunch()}>
                        <label className='cursor-pointer'  >AVVIA JOB IN STG</label>
                    </button>
                    <ToastContainer />
                </div>
            </div>
        </>
    )
}

export default PimData;