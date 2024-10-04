import { Avatar, DarkThemeToggle, Dropdown, Navbar } from 'flowbite-react';
import { signOut, useSession } from 'next-auth/react';
import React from 'react'

export default function Menu() {
    const session = useSession();

    const mainurl = process.env.NEXT_PUBLIC_URL;


  return (
    <>
   {!session?.data ?(
<>
<div className="flex md:order-3">
      <DarkThemeToggle />
        
      
      </div>
<Navbar.Collapse>
  
 <Navbar.Link href="/login" active>
          Login
        </Navbar.Link>
        <Navbar.Link href="/supplier" active>
        Supplier 
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
 </>
  )
}
