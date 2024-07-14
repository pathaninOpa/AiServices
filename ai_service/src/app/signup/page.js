"use client"
import React, {useState} from 'react'
import Navbar from '../components/Navbar'
import Link from 'next/link'

function SignupPage() {
  return (
    <div>
      <Navbar />
      <div className ="container mx-auto py-5">
        <h3>Sign-up Page</h3>
        <hr className=" my-3" />
        <form action="">
            <input className="block bg-gray-300 p-2 my-2 rounded-md"type="email" placeholder="Enter your email" />
            <input className="block bg-gray-300 p-2 my-2 rounded-md"type="password" placeholder="Create a password" />
            <button type='submit' className='bg-green-500 p-2 rounded-md'>Signup</button>
        </form>
        <hr className='my-3' />
          <p>Already signed up? <Link className='text-blue-500 hover:underline' href="/login">Log-in</Link></p>
      </div>
    </div>
  )
}

export default SignupPage