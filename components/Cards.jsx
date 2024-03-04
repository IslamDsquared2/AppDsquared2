"use client"
import React, { useState } from 'react';
import Link from 'next/link';

const Cards = ({ emoji, title, tooltip, link }) => {
    // State to manage tooltip visibility
    const [isTooltipVisible, setTooltipVisible] = useState(false);

    return (
        <Link href={link}>
            <div className='w-[300px] h-[300px] rounded-2xl border-2 border-[#E9E9E9] bg-white shadow-lg relative mt-6 md:ms-6'>
                <div className="text-black text-center font-helvetica text-9xl font-bold leading-normal">{emoji}</div>
                <h3 className="text-black text-center font-helvetica text-2xl font-semibold px-4">{title}</h3>
                {/* Modify the p tag to manage hover state and display tooltip */}
                <div 
                    className="relative"
                    onMouseEnter={() => setTooltipVisible(true)}
                    onMouseLeave={() => setTooltipVisible(false)}
                >
                    <p className="text-black text-center font-helvetica text-xs font-normal underline">
                        More Info
                    </p>
                    {isTooltipVisible && (
                        <div className="absolute bottom-full mb-2 px-2 py-1 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs rounded-md">
                            {tooltip}
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
}

export default Cards;
