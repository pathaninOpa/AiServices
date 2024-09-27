"use client"
import Link from 'next/link';
import React from 'react';
import {signOut} from 'next-auth/react'

function Navbar({ session }){
  return (
    <nav className='bg-[#333] text-white p-4 w-full'>
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          <ul className='flex'>
            <li className='mx-3'><Link className="hover:text-gray-300" href="/">Home</Link></li>
            <li className='mx-3'><Link className="hover:text-gray-300" href="/services">Services</Link></li>
          </ul>
          <ul className='flex'>
            {!session ? (
              <>
              <li className='mx-3'><Link className="hover:text-gray-300" href="/login">Sign in</Link></li>
              <li className='mx-3'><Link className="hover:text-gray-300" href="/signup">Sign up</Link></li>
              </>
            ) : (
              <>
              <li className='mx-3'><Link className="hover:text-gray-300" href="/welcome">Profile</Link></li>
              <li className='mx-3'><a className="cursor-pointer hover:text-gray-300" onClick = {() => signOut()}>Sign out</a></li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;