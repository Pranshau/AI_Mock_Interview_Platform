"use client"
import React, { useEffect } from 'react';
import Image from 'next/image';
import { UserButton } from '@clerk/nextjs';
import { usePathname } from 'next/navigation';


function Header() {
  const path = usePathname();
  useEffect(()=>{
    console.log(path);
  },[])

  return (
    <div className='flex p-4 items-center justify-between bg-secondary shadow-sm'>
      {/* <Image src="/logo.svg" width={160} height={100} alt="logo" /> */}
      <Image
  src="/logo.svg"
  alt="logo"
  width={120}
  height={60}
  className="w-[120px] h-[60px] object-contain"
/>

      <ul className='hidden md:flex gap-6  '>
        <li className={`hover:text-primary hover:font-bold transition all cursor-pointer ${path=='/dashboard' && 'text-primary font-bold'}`}>Dashboard</li>
        <li className={`hover:text-primary hover:font-bold transition all cursor-pointer ${path=='/dashboard/questions' && 'text-primary font-bold'}`}>Questions</li>
        <li className={`hover:text-primary hover:font-bold transition all cursor-pointer ${path=='/dashboard/upgrade' && 'text-primary font-bold'}`}>Upgrade</li>
        <li className={`hover:text-primary hover:font-bold transition all cursor-pointer ${path=='/dashboard/how' && 'text-primary font-bold'}`}>How It Works</li>
      </ul>
      <UserButton/>
    </div>  
  );
}

export default Header;
