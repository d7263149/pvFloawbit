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

const ExampleSidebar: FC = function () {
  const [currentPage, setCurrentPage] = useState("");

  useEffect(() => {
    const newPage = window.location.pathname;

    setCurrentPage(newPage);
  }, [setCurrentPage]);

  return (
    <Sidebar aria-label="Sidebar with multi-level dropdown example sidebarnew">
      <div className="flex h-full flex-col justify-between ">
        <div className="startdivsss">



          
        <div className="flex items-center logoimage">
            <Sidebar.Items >
              <img alt="" src="https://perfexcrm.com/demo/uploads/company/b40f7c16311848152fa744df4fda30b2.png" className="mr-3 h-6 sm:h-8" />
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

export default ExampleSidebar;
