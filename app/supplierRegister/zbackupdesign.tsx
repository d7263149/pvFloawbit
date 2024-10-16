'use client';

import { signIn, signOut, useSession } from "next-auth/react";
import { Avatar, Button, Card, Checkbox, DarkThemeToggle, Dropdown, Label, Navbar, TextInput , Textarea} from "flowbite-react";
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
            Supplier Registeration        </h2>

   <Card className="max-w-sm  center-card1  mt-[20px]">
   <div className="flex flex-col gap-4">
    
   <form className="flex flex-col gap-2">
        <div>
          <div className="mb-0 block">
            <Label htmlFor="company" value="Company Name" />
          </div>
          <TextInput id="company" type="text" placeholder="Company Name" required />
        </div>

        <div>
          <div className="mb-0 block">
            <Label htmlFor="Contact" value="Contact" />
          </div>
          <TextInput id="Contact" type="text" placeholder="Contact" required />
        </div>


        <div>
          <div className="mb-0 block">
            <Label htmlFor="Phone" value="Phone" />
          </div>
          <TextInput id="Phone" type="text" placeholder="Phone" required />
        </div>


        <div>
          <div className="mb-0 block">
            <Label htmlFor="email1" value="Company Email" />
          </div>
          <TextInput id="email1" type="text" placeholder="Company Email" required />
        </div>

        <div>
          <div className="mb-0 block">
            <Label htmlFor="Description" value="Description" />
          </div>
          <Textarea id="Description"  placeholder="Description" required />
        </div>
      </form>
     <Button onClick={()=>signIn('google',{ callbackUrl: '/redirect' })} type="submit"  color="blue" >Verify with Google</Button>
     
   </div>
 </Card>
 </div>
 </main>

)
}