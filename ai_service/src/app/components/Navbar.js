"use client"
import Link from 'next/link';
import React from 'react';
import {signOut} from 'next-auth/react'

function Navbar({ session }){
  return (
    <nav className='bg-[#333] text-white p-5 w-full'>
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          <ul className='flex'>
            <li className='mx-3'><Link href="/">Home</Link></li>
            <li className='mx-3'><Link href="/services">Services</Link></li>
          </ul>
          <ul className='flex'>
            {!session ? (
              <>
              <li className='mx-3'><Link href="/login">Sign in</Link></li>
              <li className='mx-3'><Link href="/signup">Sign up</Link></li>
              </>
            ) : (
              <>
              <li className='mx-3'><Link href="/welcome">Profile</Link></li>
              <li className='mx-3'><a onClick = {() => signOut()}>Sign out</a></li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;