'use client';

import { signIn, signOut, useSession } from "next-auth/react";
import { Avatar, Button, Card, Checkbox, DarkThemeToggle, Dropdown, Label, Navbar, TextInput } from "flowbite-react";
import Header from '../../compnents/header';


export default function Login(){
    const session = useSession();

    // console.log('session',session)
return(
    <main className="main">
        
   

       <Header/>
   <Card className="max-w-sm center-card  mt-40">
   <div className="flex flex-col gap-4">
     
   {/* <button onClick={()=>signIn('google')}>Login google </button> */}
     
     <Button onClick={()=>signIn('google',{ callbackUrl: '/dashboard' })} type="submit">Google Login</Button>
   </div>
 </Card>
 </main>

)
}