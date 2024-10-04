'use client';

import { signIn, signOut, useSession } from "next-auth/react";
import { Avatar, Button, Card, Checkbox, DarkThemeToggle, Dropdown, Label, Navbar, TextInput } from "flowbite-react";
import Header from '../../compnents/header';


export default function Login(){
    const session = useSession();
    const mainurl = process.env.NEXT_PUBLIC_URL;
return(
    <main className="main">
        
   

        <header>
       <Navbar fluid rounded>
      <Navbar.Brand href="/">
        <img src="https://flowbite.com/docs/images/logo.svg" className="mr-3 h-6 sm:h-9" alt="Flowbite React Logo" />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Flowbite React </span>
      </Navbar.Brand>
      
      
      {!session?.data ?(
<>
<div className="flex md:order-3">
      <DarkThemeToggle />
        
      
      </div>
<Navbar.Collapse>
  
 <Navbar.Link href="/login" active>
          Login
        </Navbar.Link>
        </Navbar.Collapse>
       </>
): (
<>

<div className="flex md:order-3">
      <DarkThemeToggle />
        <Dropdown
          arrowIcon={false}
          inline
          label={
            <Avatar alt="User settings" img="https://flowbite.com/docs/images/people/profile-picture-5.jpg" rounded />
          }
        >
          <Dropdown.Header>
            <span className="block text-sm">Bonnie Green</span>
            <span className="block truncate text-sm font-medium">name@flowbite.com</span>
          </Dropdown.Header>
          <Dropdown.Item href="dashboard">Dashboard</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item onClick={()=> signOut({ callbackUrl: mainurl })}>Sign out</Dropdown.Item>
        </Dropdown>
        <Navbar.Toggle />
      </div>

      
<Navbar.Collapse>
  <Navbar.Link href="/" active>
          Home
        </Navbar.Link>
        <Navbar.Link href="form">Service</Navbar.Link>
        
        </Navbar.Collapse></>)

}
       
 
      
    </Navbar>

    </header>
   <Card className="max-w-sm center-card  mt-40">
   <div className="flex flex-col gap-4">
     
   {/* <button onClick={()=>signIn('google')}>Login google </button> */}
     
     <Button onClick={()=>signIn('google',{ callbackUrl: `${mainurl}/supplier/detail` })} type="submit">Google Registration</Button>
   </div>
 </Card>
 </main>

)
}