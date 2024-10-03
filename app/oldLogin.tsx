'use client';

import { signIn } from "next-auth/react";
import { Button, Card, Checkbox, Label, TextInput } from "flowbite-react";
import Header from '../compnents/header';


export default function Login(){

return(
    <main className="main">
        
   


    <Header/>
   <Card className="max-w-sm mt-40">
   <div className="flex flex-col gap-4">
     
   {/* <button onClick={()=>signIn('google')}>Login google </button> */}
     
     <Button onClick={()=>signIn('google')} type="submit">Google Login</Button>
   </div>
 </Card>
 </main>

)
}