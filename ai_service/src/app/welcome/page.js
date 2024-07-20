"use client"
import React, {useEffect} from 'react'
import Navbar from '../components/Navbar'
import {useSession} from 'next-auth/react'
import { redirect } from 'next/navigation'
import { useRouter } from 'next/navigation'

function WelcomePage(){

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
        <div>
            <Navbar session = {session}/>
                <div className = 'comtainer mx-auto'>
                    <h3 className = 'text-3xl my-3'> Welcome {session?.user?.name}</h3>
                    <p>Email: {session?.user?.email}</p>
                        <hr className = 'my-3'/>
                        <div className="my-5">
                        <iframe
                            width="560"
                            height="315"
                            src="https://www.youtube.com/embed/gmv9A8vlqCc?start=34&autoplay=1&mute=0"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        ></iframe>
                        </div>
                </div>
        </div>
    )
}

export default WelcomePage