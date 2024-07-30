"use client"
import React, {useState, useEffect} from 'react'
import Navbar from '../components/Navbar'
import Link from 'next/link'
import {signIn} from 'next-auth/react'
import {redirect, useRouter} from 'next/navigation'
import { useSession } from 'next-auth/react'

function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [err, setError] = useState("")

  const router = useRouter();
    
  //prevent a user trying to go back to login page after login (without logout)
  const { data: session, status } = useSession()

  //solved redering router after redirecting pages problem
  useEffect(() => {
    if (status === "loading") return
    if (session) router.replace("/welcome")
  },[session, status, router])

  if(status === "loading"){
      return <p>Loading...</p>
  }

  const  handleSubmit = async (e) => {
    e.preventDefault();
    try{
      if (!email || !password){
        setError("Please Fill Out All The Forms");
        return;
      }
      const res = await signIn("credentials",{
        email, password, redirect: false
      })

      if(res.error){
        setError("Incorrect email or password")
        return
      }

      router.replace("/welcome")

    }
    catch(err){
      console.log("Error During Log-in: ",err);
    }
  }
  return (
    <div>
      <Navbar />
      <div className ="container mx-auto py-5">
        <h3>Log-in Page</h3>
        <hr className=" my-3" />
        <form onSubmit={handleSubmit}>
          {err && (
              <div className='bg-red-500 w-fit text-sm text-white py-1 px-3 rounded-md mt-2'>
                {err}
              </div>
            )}
          <input onChange={(e) => setEmail(e.target.value)} className="block bg-gray-300 p-2 my-2 rounded-md text-gray-800"type="email" placeholder="Enter your email" />
          <input onChange={(e) => setPassword(e.target.value)} className="block bg-gray-300 p-2 my-2 rounded-md text-gray-800"type="password" placeholder="Enter your password" />
          <button type='submit' className='bg-green-500 p-2 rounded-md'>Login</button>
        </form>
        <hr className='my-3' />
          <p>Do not have an account? <Link className='text-blue-500 hover:underline' href="/signup">Sign-up</Link></p>
      </div>
    </div>
  )
}

export default LoginPage