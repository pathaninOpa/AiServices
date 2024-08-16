"use client"

import Navbar from "../../components/Navbar";
import { useSession } from "next-auth/react";
import React, {useState} from 'react'
import axios from 'axios'

export default function Services() {
  const [var1, setVar1] = useState("");
  const [var2, setVar2] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const {data: session} = useSession()

  const someFunction = async (e) => {
    e.preventDefault();
    try{
      if (!var1 || !var2) {
        setSuccess("");
        setError("Bro stupid");
        return;
      }
      else {
        setSuccess("Bro smart");
        setError("");
        const result = await axios.post("/api/calculator", {'var1': var1, 'var2': var2});
        const resultBox = document.getElementById("result");
        resultBox.textContent = result.data.message; // This should now display the sum.
        console.log(result.data.message); // This should log the sum.
        return;
      }
    }
    catch(errorSomething){
      console.log(errorSomething);
      setSuccess("");
      setError(errorSomething);
      return;
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-2">
      <Navbar session = {session}/>
      <div className = "flex items-center justify-center flex-grow">
        {!session ? (<p className = "text-center">
          Welcome to Ai Services...Please signin/signup at the top right corner
        </p>) : (
        <div className="container mx-auto py-5">
          <p className="text-center">Welcome {session?.user?.name}...This is the addition calculator</p>
          <form onSubmit={someFunction}>
            {error && (
              <div className='bg-red-500 w-fit text-sm text-white py-1 px-3 rounded-md mt-2'>
                {error}
              </div>
            )}
            {success && (
              <div className='bg-green-500 w-fit text-sm text-white py-1 px-3 rounded-md mt-2'>
                {success}
              </div>
            )}
            <input onChange={(e) => setVar1(e.target.value)} className="block bg-gray-300 p-2 my-2 rounded-md text-gray-800" type="number" placeholder="Enter Value 1"></input>
            <input onChange={(e) => setVar2(e.target.value)} className="block bg-gray-300 p-2 my-2 rounded-md text-gray-800" type="number" placeholder="Enter Value 2"></input>
            <button type='submit' className='bg-green-500 p-2 text-gray-50 rounded-md'>Submit</button>
          </form>
          <p id="result" className="text-center"></p>
        </div>
        )}
      </div> 
    </main>
  );
}