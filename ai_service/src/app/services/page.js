"use client"

import Navbar from "../components/Navbar";
import { useSession } from "next-auth/react";
import React from 'react'
import {useEffect} from 'react'
import { redirect } from 'next/navigation'
import { useRouter } from 'next/navigation'

export default function Services() {
    const {data: session, status} = useSession()
    const router = useRouter()
    //debug zone//
    //console.log(session)

    useEffect(() => {
        if (status === "loading") return
        if (!session) redirect("/login")
    },[session, status, router])

    if(status === "loading"){
        return <p>Loading...</p>
    }

    return (
      <main className="flex min-h-screen flex-col items-center justify-between p-2">
      <Navbar session = {session}/>
      <div className = "flex items-center justify-center flex-grow">
        {!session ? (<p className = "text-center">
          Welcome to Ai Services...Please signin/signup at the top right corner
        </p>) : (
        <div className="container mx-auto py-5">
          <p className="text-center">Welcome {session?.user?.name}...This page contains services.</p>
          <ul>
            <li><a className="text-blue-600/75 underline" href="/services/calculator">Calculator</a></li>
            <li>ssss</li>
          </ul>
        </div>
        )}
      </div> 
    </main>
    )
}