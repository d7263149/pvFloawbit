'use client';

import { signIn, signOut, useSession } from "next-auth/react";
import { Avatar, Button, Card, Checkbox, DarkThemeToggle, Dropdown, Label, Navbar, TextInput } from "flowbite-react";
import Header from '../../compnents/header';


export default function Login(){
    const session = useSession();
    const mainurl = process.env.NEXT_PUBLIC_URL;
    // console.log('session',session)
return(
    <main className="main">
        
   

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