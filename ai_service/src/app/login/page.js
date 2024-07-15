"use client"
import React, {useState} from 'react'
import Navbar from '../components/Navbar'
import Link from 'next/link'
import axios from 'axios'

function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [err, setError] = useState("")
  const [success, setSuccess] = useState("")
  const  handleSubmit = async (e) => {
    e.preventDefault();
    try{
      if (!email || !password){
        setError("Please Fill Out All The Forms");
        return;
      }
      const resgister = await axios.post("/api/register",{ // this will be change when we have hosting service (when we deploy)
        'email':email,
        'password':password
      });
      /*ToDo: add api get to check user input pass and email with User's data from database*/
      if (resgister.status === 200){
        const form = e.target;
        setError("");
        setSuccess("Login successfully.");
        form.reset();
      }else{
        console.log("User Log-in Failed.");
      }
    }catch(err){
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
            {success && (
              <div className='bg-green-500 w-fit text-sm text-white py-1 px-3 rounded-md mt-2'>
                {success}
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