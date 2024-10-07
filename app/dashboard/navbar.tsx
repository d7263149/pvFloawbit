"use client";
import type { FC } from "react";
import { Avatar, Button, DarkThemeToggle, Dropdown, Label, Navbar, TextInput } from "flowbite-react";
import { signOut, useSession } from "next-auth/react";

const ExampleNavbar: FC = function () {
    const session = useSession();
    console.log('session' , session)
    const mainurl = process.env.NEXT_PUBLIC_URL;
  return (
    <Navbar fluid>
      <div className="w-full p-1.5 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
          <div className="sm:flex">
          <div className="mb-3 hidden items-center dark:divide-gray-700 sm:mb-0 sm:flex sm:divide-x sm:divide-gray-100">
          <form className="lg:pr-3">
                  <Label htmlFor="users-search" className="sr-only">
                    Search
                  </Label>
                  <div className="relative mt-1 lg:w-64 xl:w-96">
                    <TextInput
                      id="users-search"
                      name="users-search"
                      className="navserach"
                      placeholder="Search for users"
                    />
                  </div>
                </form>
                </div></div>
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
          <Dropdown.Item onClick={()=> signOut({ callbackUrl: mainurl })}>Sign out</Dropdown.Item>
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
