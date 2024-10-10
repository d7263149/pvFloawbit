import { Navbar, Sidebar, TextInput } from "flowbite-react";
import type { FC } from "react";
import { useEffect, useState } from "react";
import {
  HiChartPie,
  HiClipboard,
  HiCollection,
  HiInformationCircle,
  HiLogin,
  HiPencil,
  HiSearch,
  HiShoppingBag,
  HiUsers,
  HiHome
} from "react-icons/hi";
import { signOut, useSession } from "next-auth/react";
const ExampleSidebar: FC = function () {
  const [currentPage, setCurrentPage] = useState("");

  useEffect(() => {
    const newPage = window.location.pathname;

    setCurrentPage(newPage);
  }, [setCurrentPage]);
  const session = useSession();
  console.log('session1' , session)
  const mainurl = process.env.NEXT_PUBLIC_URL;


  const pagesArray = ['/dashboard/UserManagement', '/dashboard/UserManagement/role', '/contact'];

  const isPageInArray = pagesArray.includes(currentPage);
  const [isOpen, setIsOpen] = useState(false);


  useEffect(() => {
   if(isPageInArray){
    setIsOpen(true);
   }
  }, [isPageInArray]);

    const toggleSubItems = () => {
      setIsOpen(!isOpen);
    };











//@ts-ignore
  if (session?.data?.user?.role === 'supplier') {
    return (
      <Sidebar aria-label="Sidebar with multi-level dropdown example sidebarnew">
      <div className="flex h-full flex-col justify-between ">
        <div className="startdivsss">



          
        <div className="flex items-center logoimage">
            <Sidebar.Items >
            <img alt="" src="/images/logo.png" style={{    height: '62px', width: '100%'}} className="mr-3 h-6 sm:h-8" />
              <span className="self-center whitespace-nowrap text-2xl font-semibold dark:text-white">
                {/* Admin */}
              </span>
            </Sidebar.Items>
          </div>



          <form className="pb-3 md:hidden">
            <TextInput
              icon={HiSearch}
              type="search"
              placeholder="Search"
              required
              size={32}
            />
          </form>
          <Sidebar.Items>
            <Sidebar.ItemGroup>
              <Sidebar.Item
                href="/dashboard"
                icon={HiHome}
                className={
                  "/dashboard" === currentPage ? "bg-gray-100 dark:bg-gray-700" : ""
                }
              >
                Dashboard
              </Sidebar.Item>
              {/* <Sidebar.Item
                href="/"
                icon={HiChartPie}
                className={
                  "/" === currentPage ? "bg-gray-100 dark:bg-gray-700" : ""
                }
              >
                Website
              </Sidebar.Item> */}
              {/* <Sidebar.Item
                href="/dashboard"
                icon={HiShoppingBag}
                className={
                  "/dashboard" === currentPage
                    ? "bg-gray-100 dark:bg-gray-700"
                    : ""
                }
              >
                Products
              </Sidebar.Item> */}
              
              
            
              <Sidebar.Item
                href="/dashboard/myservce"
                icon={HiUsers}
                className={
                  "/dashboard/myservce" === currentPage
                    ? "bg-gray-100 dark:bg-gray-700"
                    : ""
                }
              >My Service List
               
              </Sidebar.Item>
              <Sidebar.Item
                href="/dashboard/serviceorder"
                icon={HiUsers}
                className={
                  "/dashboard/serviceorder" === currentPage
                    ? "bg-gray-100 dark:bg-gray-700"
                    : ""
                }
              >
               Service Order
              </Sidebar.Item>
              </Sidebar.ItemGroup>
              {/* <Sidebar.ItemGroup>
              <Sidebar.Item
                href="/dashboard/myservce"
                icon={HiUsers}
                className={
                  "/dashboard/myservce" === currentPage
                    ? "bg-gray-100 dark:bg-gray-700"
                    : ""
                }
              >My servce
               
              </Sidebar.Item>
            </Sidebar.ItemGroup> */}
            {/* <Sidebar.ItemGroup>
              <Sidebar.Item
                href="#"
                icon={HiClipboard}
              >
                Docs
              </Sidebar.Item>
              <Sidebar.Item
                href="#"
                icon={HiCollection}
              >
                Components
              </Sidebar.Item>
              <Sidebar.Item
                href="#"
                icon={HiInformationCircle}
              >
                Help
              </Sidebar.Item>
            </Sidebar.ItemGroup> */}
          </Sidebar.Items>
        </div>
      </div>
    </Sidebar>
    )
  }


















  if (session?.data?.user?.role === 'admin') {

  

  return (
    <Sidebar aria-label="Sidebar with multi-level dropdown example sidebarnew">
      <div className="flex h-full flex-col justify-between ">
        <div className="startdivsss">



          
        <div className="flex items-center logoimage">
            <Sidebar.Items >
            {/* https://perfexcrm.com/demo/uploads/company/b40f7c16311848152fa744df4fda30b2.png */}
            <img alt="" src="/images/logo.png" style={{    height: '62px', width: '100%'}} className="mr-3 h-6 sm:h-8" />
              <span className="self-center whitespace-nowrap text-2xl font-semibold dark:text-white">
                {/* Admin */}
              </span>
            </Sidebar.Items>
          </div>



          <form className="pb-3 md:hidden">
            <TextInput
              icon={HiSearch}
              type="search"
              placeholder="Search"
              required
              size={32}
            />
          </form>
          <Sidebar.Items>
            <Sidebar.ItemGroup>
              <Sidebar.Item
                href="/dashboard"
                icon={HiHome}
                className={
                  "/dashboard" === currentPage ? "bg-gray-100 dark:bg-gray-700" : ""
                }
              >
                Dashboard
              </Sidebar.Item>
              {/* <Sidebar.Item
                href="/"
                icon={HiChartPie}
                className={
                  "/" === currentPage ? "bg-gray-100 dark:bg-gray-700" : ""
                }
              >
                Website
              </Sidebar.Item> */}
              {/* <Sidebar.Item
                href="/dashboard"
                icon={HiShoppingBag}
                className={
                  "/dashboard" === currentPage
                    ? "bg-gray-100 dark:bg-gray-700"
                    : ""
                }
              >
                Products
              </Sidebar.Item> User Management   */}
                           {/* <Sidebar.Item
                href="/dashboard/UserManagement"
                icon={HiUsers}
                className={
                  "/dashboard/UserManagement" === currentPage
                    ? "bg-gray-100 dark:bg-gray-700"
                    : ""
                }
              >
                 User Management
              </Sidebar.Item> */}

<li>
            <a href="#" onClick={toggleSubItems} type="button" className="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700" aria-controls="dropdown-example" data-collapse-toggle="dropdown-example">
            <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 20 20" aria-hidden="true" data-testid="flowbite-sidebar-item-icon" className="h-6 w-6 flex-shrink-0 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"></path></svg>
                  <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap"> User Management</span>
                  <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                     <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
                  </svg>
            </a>
            <ul id="dropdown-example " className={isOpen ? ' py-2 space-y-2' : 'hidden py-2 space-y-2'} >
                  <li>
                     <a href="/dashboard/UserManagement" className={
                  "/dashboard/UserManagement" === currentPage
                    ? "flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 bg-gray-100 dark:bg-gray-700"
                    : "flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"}>User</a>
                  </li>
                  <li>
                     <a href="/dashboard/UserManagement/role" className={
                  "/dashboard/UserManagement/role" === currentPage
                    ? "flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 bg-gray-100 dark:bg-gray-700"
                    : "flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"}>Role</a>
                  </li>
                 
            </ul>
         </li>



              <Sidebar.Item
                href="/dashboard/supplier"
                icon={HiUsers}
                className={
                  "/dashboard/supplier" === currentPage
                    ? "bg-gray-100 dark:bg-gray-700"
                    : ""
                }
              >
                 Supplier List
              </Sidebar.Item>
              <Sidebar.Item
                href="/dashboard/customer"
                icon={HiUsers}
                className={
                  "/dashboard/customer" === currentPage
                    ? "bg-gray-100 dark:bg-gray-700"
                    : ""
                }
              >Customer List
               
              </Sidebar.Item>
              <Sidebar.Item
                href="/dashboard/service"
                icon={HiUsers}
                className={
                  "/dashboard/service" === currentPage
                    ? "bg-gray-100 dark:bg-gray-700"
                    : ""
                }
              >Service List
               
              </Sidebar.Item>
              <Sidebar.Item
                href="/dashboard/serviceorder"
                icon={HiUsers}
                className={
                  "/dashboard/serviceorder" === currentPage
                    ? "bg-gray-100 dark:bg-gray-700"
                    : ""
                }
              >
               Service Order
              </Sidebar.Item>
              </Sidebar.ItemGroup>
              {/* <Sidebar.ItemGroup>
              <Sidebar.Item
                href="/dashboard/myservce"
                icon={HiUsers}
                className={
                  "/dashboard/myservce" === currentPage
                    ? "bg-gray-100 dark:bg-gray-700"
                    : ""
                }
              >My servce
               
              </Sidebar.Item>
            </Sidebar.ItemGroup> */}
            {/* <Sidebar.ItemGroup>
              <Sidebar.Item
                href="#"
                icon={HiClipboard}
              >
                Docs
              </Sidebar.Item>
              <Sidebar.Item
                href="#"
                icon={HiCollection}
              >
                Components
              </Sidebar.Item>
              <Sidebar.Item
                href="#"
                icon={HiInformationCircle}
              >
                Help
              </Sidebar.Item>
            </Sidebar.ItemGroup> */}
          </Sidebar.Items>
        </div>
      </div>
    </Sidebar>
  );
};
}

export default ExampleSidebar;
