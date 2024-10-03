"use client";
import type { FC } from "react";
import { Avatar, Button, DarkThemeToggle, Dropdown, Navbar } from "flowbite-react";
import { signOut, useSession } from "next-auth/react";

const ExampleNavbar: FC = function () {
    const session = useSession();
  return (
    <Navbar fluid>
      <div className="w-full p-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Navbar.Brand href="/">
              {/* <img alt="" src="/images/logo.svg" className="mr-3 h-6 sm:h-8" /> */}
              <span className="self-center whitespace-nowrap text-2xl font-semibold dark:text-white">
                Admin
              </span>
            </Navbar.Brand>
          </div>
          <div className="flex items-center gap-3">
            {/* <iframe
              height="30"
              src="https://ghbtns.com/github-btn.html?user=themesberg&repo=flowbite-react-admin-dashboard&type=star&count=true&size=large"
              title="GitHub"
              width="90"
              className="hidden sm:block"
            /> */}
            {/* <Button color="primary" href="https://flowbite.com/pro/">
              Upgrade to Pro
            </Button> */}
            {/* <DarkThemeToggle />
             */}

{!session?.data ?(
<>

      <DarkThemeToggle />
        
      
    

       </>
): (
<>


      <DarkThemeToggle />
        <Dropdown
          arrowIcon={false}
          inline
          label={
            <Avatar alt="User settings" img="https://flowbite.com/docs/images/people/profile-picture-5.jpg" rounded />
          }
        >
          <Dropdown.Header>
            <span className="block text-sm">{session?.data?.user?.name}</span>
            <span className="block truncate text-sm font-medium">{session?.data?.user?.email}</span>
          </Dropdown.Header>
          <Dropdown.Item href="dashboard">Dashboard</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item onClick={()=> signOut({ callbackUrl: '../' })}>Sign out</Dropdown.Item>
        </Dropdown>
        <Navbar.Toggle />
 
</>)

}
          </div>
        </div>
      </div>
    </Navbar>
  );
};

export default ExampleNavbar;
