"use client"
import React, {useState} from 'react'
import Navbar from '../components/Navbar'
import Link from 'next/link'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'

function SignupPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [err, setError] = useState("")
  const [success, setSuccess] = useState("")

  //debugging zone//
  console.log(name, email, password, confirmPassword)

  //prevent a user trying to go back to signup page after login (without logout)
  const { data: session } = useSession()
  if (session) redirect("/welcome")

  const  handleSubmit = async (e) => {
    e.preventDefault();
    try{
      if (!name || !email || !password || !confirmPassword){
        setSuccess("");
        setError("Please Fill Out All The Forms");
        return;
      }
      if (password != confirmPassword){
        setSuccess("");
        setError("Password Do Not Match!!");
        return;
      }

      //check existing email
      const resExistedEmail = await axios.post("/api/existedEmail",{'email':email});
      if(resExistedEmail.data.exists){
        setSuccess("");
        setError("Email already exists.")
        return;
      }

      //registration
      const resgister = await axios.post("/api/register",{ // this will be change when we have hosting service (when we deploy)
        'name':name,
        'email':email,
        'password':password
      });
      if (resgister.status === 200){
        const form = e.target;
        setError("");
        setSuccess("Registration successfully.");
        form.reset();

        //localStorage.setItem('name',name), // save variable in local storage for futher usage. ** To do: optimise this ** _Tae Note: Im not sure if this is common practice
        //window.location.href = '/'; // save to the desired page, modify to change destination
      } else{
        console.log("User registration failed.");
      }
    }catch(err){
      console.log("Error During Registration: ",err)
    }
  }
  return (
    <div>
      <Navbar />
      <div className ="container mx-auto py-5">
        <h3>Sign-up Page</h3>
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
          <input onChange={(e) => setName(e.target.value)} className="block bg-gray-300 p-2 my-2 rounded-md text-gray-800"type="text" placeholder="Enter your name" />
          <input onChange={(e) => setPassword(e.target.value)} className="block bg-gray-300 p-2 my-2 rounded-md text-gray-800"type="password" placeholder="Enter your password" />
          <input onChange={(e) => setConfirmPassword(e.target.value)} className="block bg-gray-300 p-2 my-2 rounded-md text-gray-800"type="password" placeholder="Confirm your password" />
          <button type='submit' className='bg-green-500 p-2 text-gray-50 rounded-md'>Sign up</button>
        </form>
        <hr className='my-3' />
          <p>Already signed up? <Link className='text-blue-500 hover:underline' href="/login">Sign-in</Link></p>
      </div>
    </div>
  )
}

export default SignupPage