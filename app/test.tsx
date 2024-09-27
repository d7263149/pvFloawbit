"use client";
import React from "react";
import { Button } from "flowbite-react";
import { Avatar, Dropdown, Navbar } from "flowbite-react";
import { DarkThemeToggle } from "flowbite-react";
import { Footer } from "flowbite-react";
import { Checkbox, Table } from "flowbite-react";
import { db } from "../compnents/firebase"
import { collection, getDocs, orderBy, query, onSnapshot, doc, where, limit } from 'firebase/firestore'
import { useEffect } from "react";
export default function Homed() {


//@ts-ignore
const [data, setDogs] = React.useState<Dog[]>([]);

useEffect(() => {

  // , where("mintType", "==", 'paid') 
   const dogsCol = query(collection(db, "strexService"), limit(10));
  //  let dogsCol = collection(db, 'autoTopTrendingMints');
    const unSubscribe = onSnapshot(dogsCol, dogsSnap => {
        const dogsArray = dogsSnap.docs.map(dogSnap => {
          //@ts-ignore
            const dog = dogSnap.data() as Dog;
            dog.id = dogSnap.id;
            return dog;
        });
        // console.log('dogsArray1',dogsArray);
        setDogs(dogsArray)     

        console.log(dogsArray);
// setRowData(dogsArray)
dogsArray.sort((a, b) => parseFloat(b.sixHourCount) - parseFloat(a.sixHourCount));

// setRowData(dogsArray)
//       setRowDataold(dogsArray)

// console.log('dogsArrayaftershort',dogsArray);


    });

    return () => unSubscribe();
},[]);


  return (
    <main className="">
        
    <Navbar fluid rounded>
      <Navbar.Brand href="https://flowbite-react.com">
        <img src="https://flowbite.com/docs/images/logo.svg" className="mr-3 h-6 sm:h-9" alt="Flowbite React Logo" />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Flowbite React</span>
      </Navbar.Brand>
      <div className="flex md:order-2">
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
          <Dropdown.Item>Dashboard</Dropdown.Item>
          <Dropdown.Item>Settings</Dropdown.Item>
          <Dropdown.Item>Earnings</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item>Sign out</Dropdown.Item>
        </Dropdown>
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Navbar.Link href="#" active>
          Home
        </Navbar.Link>
        <Navbar.Link href="#">About</Navbar.Link>
        <Navbar.Link href="#">Services</Navbar.Link>
        <Navbar.Link href="#">Pricing</Navbar.Link>
        <Navbar.Link href="#">Contact</Navbar.Link>
      </Navbar.Collapse>
    </Navbar>







    <section className="body p-7" style={{minHeight:'300px'}}>
    <div className="overflow-x-auto">
      <Table hoverable>
        <Table.Head>
          <Table.HeadCell className="p-4">
            {/* <Checkbox /> */}
          </Table.HeadCell>
          <Table.HeadCell> name</Table.HeadCell>
          <Table.HeadCell>description</Table.HeadCell>
          <Table.HeadCell>duration</Table.HeadCell>
          <Table.HeadCell>cost</Table.HeadCell>
          {/* <Table.HeadCell>
            <span className="sr-only">Edit</span>
          </Table.HeadCell> */}
        </Table.Head>
        <Table.Body className="divide-y ">


        {data.map(item => (
          <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800 mt-8">
            <Table.Cell className="p-4">
              {/* <Checkbox /> */}
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
            {item?.name}
            </Table.Cell>
            <Table.Cell>{item?.description}</Table.Cell>
            <Table.Cell>{item?.duration}</Table.Cell>
            <Table.Cell>{item?.cost}</Table.Cell>
            {/* <Table.Cell>
              <a href="#" className="font-medium text-cyan-600 hover:underline dark:text-cyan-500">
                Edit
              </a>
            </Table.Cell> */}
          </Table.Row>
            ))}




         
        </Table.Body>
      </Table>
    </div>
    </section>










    <Footer container>
      <div className="w-full text-center">
        <div className="w-full justify-between sm:flex sm:items-center sm:justify-between">
          <Footer.Brand
            href="https://flowbite.com"
            src="https://flowbite.com/docs/images/logo.svg"
            alt="Flowbite Logo"
            name="Flowbite"
          />
          <Footer.LinkGroup>
            <Footer.Link href="#">text</Footer.Link>
            <Footer.Link href="#">Privacy Policy</Footer.Link>
            <Footer.Link href="#">Licensing</Footer.Link>
            <Footer.Link href="#">Contact</Footer.Link>
          </Footer.LinkGroup>
        </div>
        <Footer.Divider />
        <Footer.Copyright href="#" by="Flowbite™" year={2022} />
      </div>
    </Footer>

      {/* <h1 className="text-2xl dark:text-white">Flowbite React + Next.js</h1>
      <DarkThemeToggle /> */}
    </main>
  );
}
