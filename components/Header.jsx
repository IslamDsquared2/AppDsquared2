import React from 'react'
import Image from 'next/image'
import Link from 'next/link';
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
//  import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
function Header({ isDsquared2 }) {
    // const { getisDsquared2 } = getKindeServerSession();
    // const isDsquared2 = await getisDsquared2();
    return (
        <>
            {!isDsquared2 ? (
                <div className='bg-black text-white py-7 flex justify-center items-center'>
                    <Link href="/"> <Image src="/logoTitle.svg" alt="Logo immagine" width={261} height={33} /> </Link>
                </div>
            ) : (
                <div className="bg-black text-white py-7 flex flex-row justify-between items-center">
                    <div className="flex-1"></div> {/* Spazio vuoto a sinistra */}
                    <div className="flex-1">
                        <Link href="/">
                            <Image src="/logoTitle.svg" alt="Logo immagine" width={261} height={33} className="mx-auto" />
                        </Link>
                    </div>
                    <div className="flex-1 flex justify-end">
                        <div className="flex items-center space-x-2 mr-4">
                            <span className="text-sm text-white ">Hello , {isDsquared2.family_name} {isDsquared2.given_name}</span>
                         {isDsquared2?.picture ? <img src={isDsquared2?.picture} alt="Immagine Utente" width={40} height={40} className="rounded-full" /> : <img src="https://www.svgrepo.com/show/384676/account-avatar-profile-user-6.svg" alt="Immagine Utente" width={40} height={40} className="rounded-full" /> }
                        </div>
                        <LogoutLink> <button className="text-sm text-white bg-red-600 p-2 rounded-md me-4">Logout</button> </LogoutLink>
                    </div>
                </div>
            )}
        </>
    )
}

export default Header