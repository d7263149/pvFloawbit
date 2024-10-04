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
       <div className="mt-[40px]">
       <div className="company-logo text-center">
            <a href="https://perfexcrm.com/demo/" className="logo img-responsive">
        <img src="https://perfexcrm.com/demo/uploads/company/1f03e41865e3e0d535f6202e5fba391a.png" className="img-responsive" alt="Perfex CRM" />
        </a>        </div>

       <h1 className="  tw-text-2xl tw-text-neutral-800 text-center tw-font-semibold tw-mb-5 mb-10">
            Registeration        </h1>

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
        <Button type="submit">Submit</Button>
      </form>
   {/* <button onClick={()=>signIn('google')}>Login google </button> */}
   
     
     <Button onClick={()=>signIn('google',{ callbackUrl: `${mainurl}/supplier/detail` })} type="submit">Google Registeration</Button>
     <Button  color="dark" href={mainurl+'/login'}>Login</Button>
   </div>
 </Card>
 </div>
 </main>

)
}