"use client";
import React, { useState } from "react";
import { Alert, Button, Card, Label, TextInput } from "flowbite-react";
import { Avatar, Dropdown, Navbar } from "flowbite-react";
import { DarkThemeToggle } from "flowbite-react";
import { Footer } from "flowbite-react";
import { Checkbox, Table } from "flowbite-react";
import { db } from "../../compnents/firebase"
import Header from '../../compnents/header';
import { collection, getDocs, orderBy, query, onSnapshot, doc, where, limit, addDoc } from 'firebase/firestore'
import { useEffect } from "react";

import {signOut, useSession} from 'next-auth/react'


export default function Homed() {

  const session = useSession();

//@ts-ignore
const [data, setDogs] = React.useState<Dog[]>([]);
const [alert, setAlert] = React.useState('none');
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


const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration: '',

    cost: ''
  });

  // Handle input changes
  const handleChange = (e: { target: { id: any; value: any; }; }) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    console.log('Form Data:', formData);
    // Process or send formData to a server here

    try {
        // Insert into Firestore
        const docRef = await addDoc(collection(db, 'strexService'), {
          name: formData.name,
          description: formData.description,
          duration: formData.duration,
          cost: formData.cost,
          byemail: session?.data?.user?.email,
        });
        setAlert("block");
        console.log('Document written with ID: ', docRef.id);
      } catch (e) {
        console.error('Error adding document: ', e);
      }
      
  };










  return (
    <main className="">
        
        <Header/>


        <Card  className="bg-white dark:bg-gray-900 bg-[url('https://flowbite.s3.amazonaws.com/docs/jumbotron/hero-pattern.svg')] dark:bg-[url('https://flowbite.s3.amazonaws.com/docs/jumbotron/hero-pattern-dark.svg')]">
        <h3 className="mb-4 mt-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900  dark:text-white">Add Service</h3>
    </Card>



    <section className="body p-7 " style={{minHeight:'300px', display: 'block',  marginLeft: 'auto',  marginRight: 'auto',  width: '40%'}}>
    <div className="overflow-x-auto">
      
    <Card  className="max-w-sm">

    <Alert id="alert" style={{display:alert}} color="success">
      <span className="font-medium">Info alert!</span> Successfully save
    </Alert>

    <form onSubmit={handleSubmit} className="flex max-w-md flex-col gap-4">
      <div>
        <div className="mb-2 block">
          <Label htmlFor="name" value=" name" />
        </div>
        <TextInput  type="text"
          id="name"
          value={formData.name}
          onChange={handleChange} required />
      </div>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="description"   value="description"  />
          
        </div>
        <TextInput id="description" type="text" value={formData.description}
          onChange={handleChange} placeholder="description"  required />
      </div>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="duration" value="duration" />
        </div>
        <TextInput id="duration"     value={formData.duration}   onChange={handleChange} type="text" required />
      </div>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="cost" value="cost" />
        </div>
        <TextInput id="cost"  value={formData.cost}
          onChange={handleChange} type="text" required />
      </div>
      {/* <div className="flex items-center gap-2">
        <Checkbox id="remember" />
        <Label htmlFor="remember">Remember me</Label>
      </div> */}
      <Button type="submit">Submit</Button>
    </form>
    </Card>

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
