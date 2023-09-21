import React from 'react'
import Image from 'next/image'
import Link from 'next/link';

function Header() {
    return (
        <div className='bg-black text-white py-7 flex justify-center items-center'>
            <Link href="/"> <Image src="/logoTitle.svg" alt="Logo immagine" width={261} height={33} /> </Link>
        </div>
    )
}

export default Header