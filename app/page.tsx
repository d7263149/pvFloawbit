"use client";
import Image from "next/image";
import {signOut, useSession} from 'next-auth/react'
import Home1 from "./pages/index";
import Login from "./login/page";
export default function Home() {
// const session = useSession();
// console.log('session',session);
  return (
     <>
     <Login/>
  {/* <div>{session?.data?.user?.name } </div> */}
{/* <button onClick={()=> signOut()}>Logout</button> */}
</>
  );
}
