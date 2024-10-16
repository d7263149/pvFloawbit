'use client';

import { signIn, signOut, useSession } from "next-auth/react";
import { Avatar, Button, Card, Checkbox, DarkThemeToggle, Dropdown, Label, Navbar, TextInput } from "flowbite-react";
import Header from '../../compnents/header';
// pages/_app.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';
// import { toast, ToastContainer } from "react-toastify";
import { ToastContainer, toast } from 'react-toastify'; // Import Toast for notifications
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS
import { useSearchParams } from 'next/navigation';



export default function Login(){
// console.log('props',props.msg);
const searchParams:any = useSearchParams();
  // const searchParams = useSearchParams()
 
  const search:any = searchParams.get('msg')


    const session = useSession();
    const mainurl = process.env.NEXT_PUBLIC_URL;



    useEffect(() => {
      // Function to check for the 'msg' query parameter
 
  
        if (search) {
          // showToast('working');
          toast.success(search);
        }
 
  
      // router.events.on('routeChangeComplete', handleRouteChange);
  
      // // Clean up the event listener
      // return () => {
      //   router.events.off('routeChangeComplete', handleRouteChange);
      // };
    }, [search]);




    
    // console.log('session',session)
return(
    <main className="main">
      
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

       {/* <Header/> */}
       <div className="mt-[80px]">
       <div className="company-logo text-center">
            <a href={mainurl} className="logo img-responsive">
        <img src="/images/black.png" style={{    height: '62px'}} className="img-responsive" alt=" CRM" />
        </a>        </div>

       <h2 style={{    fontSize: '22px'}} className="   tw-text-neutral-800 text-center tw-font-semibold tw-mb-5 mb-4 mt-8">
            Login        </h2>

   <Card className="max-w-sm  center-card1  mt-[20px]">
   <div className="flex flex-col gap-4">
    
   <form className="flex flex-col gap-4">
        <div>
          <div className="mb-2 block">
            <Label htmlFor="email1" value="Your email" />
          </div>
          <TextInput id="email1" type="email" placeholder="name@flowbite.com" required />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="password1" value="Your password" />
          </div>
          <TextInput id="password1" type="password" required />
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="remember" />
          <Label htmlFor="remember">Remember me</Label>
        </div>
        <Button type="submit"  color="blue">Login</Button>
      </form>
   {/* <button onClick={()=>signIn('google')}>Login google </button> */}
   
     
     <Button onClick={()=>signIn('google',{ callbackUrl: '/redirect' })} type="submit"  color="dark" >Continue with Google</Button>
     {/* <Button  color="dark">Register</Button> */}
     <p className="text-center ">Don't have an account? <a className="text-blue-600 hover:text-blue-800"  href={mainurl+'/register'}>Rigister</a></p>
     
   </div>
 </Card>
 </div>
 </main>

)
}

function showToast(message: string) {
  throw new Error("Function not implemented.");
}
