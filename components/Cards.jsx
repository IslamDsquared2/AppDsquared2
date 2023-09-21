import React from 'react'
import Link from 'next/link'

const Cards = ({ emoji, title, tooltip, link }) => {
    return (
        
        <Link href={link}>
            <div className='w-[300px] h-[300px] rounded-2xl border-2 border-[#E9E9E9] bg-white shadow-lg relative mt-6 md:ms-6'>
                <div className="text-black text-center font-helvetica text-9xl font-bold leading-normal">{emoji}</div>
                <h3 className="text-black text-center font-helvetica text-2xl font-semibold px-4">{title}</h3>
                <p className="text-black text-center font-helvetica text-xs font-normal underline absolute bottom-0 left-1/2 transform -translate-x-1/2">More Info</p>
            </div>
        </Link>
    );
}

export default Cards