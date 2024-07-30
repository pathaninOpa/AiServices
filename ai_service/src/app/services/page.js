"use client"

import Navbar from "../components/Navbar";
import { useSession } from "next-auth/react";

export default function Home() {

  const {data: session} = useSession()

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-2">
      <Navbar session = {session}/>
      <div className = "flex items-center justify-center flex-grow">
        {!session ? (<p className = "text-center">
          Welcome to Ai Services...Please signin/signup at the top right corner
        </p>) : (<p className = "text-center">
          Welcome {session?.user?.name}...This page contains services.
        </p>)}
      </div>
    </main>
  );
}