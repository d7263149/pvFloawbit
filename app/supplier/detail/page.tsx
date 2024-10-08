"use client";
import React, { useState } from "react";
import { Alert, Button, Card, Label, TextInput } from "flowbite-react";
import { Avatar, Dropdown, Navbar } from "flowbite-react";
import { DarkThemeToggle } from "flowbite-react";
import { Footer } from "flowbite-react";
import { Checkbox, Table } from "flowbite-react";
import { db } from "../../../compnents/firebase"
import Header from '../../../compnents/header';
import { collection, getDocs, orderBy, query, onSnapshot, doc, where, limit, addDoc } from 'firebase/firestore'
import { useEffect } from "react";

import {getSession, signOut, useSession} from 'next-auth/react'


export default function Homed() {
  const mainurl = process.env.NEXT_PUBLIC_URL;
  const session:any = useSession();
   const { update } = useSession();
console.log('session',session)
//@ts-ignore
const [data, setDogs] = React.useState<Dog[]>([]);
const [alert, setAlert] = React.useState('none');
const [getemail, setEmail] = React.useState('');
const [role, setRole] = React.useState('');


useEffect(() => {
// console.log('working',getemail);
// console.log('data',data?.[0]?.role)
  async function mains(rolemain:any){




if (session) {
  const updateSession = await update({email: data?.[0]?.email,name: data?.[0]?.name,role: data?.[0]?.role});
  // window.location.href=mainurl+'/dashboard';
}

}
console.log('data?.[0]?.role',data?.[0]?.role);
if(data?.[0]?.role){
   mains(data?.[0]?.role);
}
//


  // async function updateProfile(newData) {
  //   // Perform your update logic (e.g., API request to update user data)
  
  //   // Optionally refresh the session
  //   const session = await getSession();
  //   if (session) {
  //     // Manually trigger a session update
  //     await fetch("/api/auth/session?update", {
  //       method: "POST",
  //     });
  //   }
  // }



  }, [data]);



useEffect(() => {
console.log('email ', session?.data?.user?.email)
  // , where("mintType", "==", 'paid') 
  //  const dogsCol = query(collection(db, "strexSupplier"), where("email", "==", getemail));
  if(session?.data?.user?.email){
    setEmail(session?.data?.user?.email);
  const dogsCol = query(collection(db, "strexSupplier"), where("email", "==", session?.data?.user?.email), limit(10));
  //  let dogsCol = collection(db, 'autoTopTrendingMints');
    const unSubscribe = onSnapshot(dogsCol, dogsSnap => {
        const dogsArray = dogsSnap.docs.map(dogSnap => {
          //@ts-ignore
            const dog = dogSnap.data() as Dog;
            dog.id = dogSnap.id;
            return dog;
        });
        setDogs(dogsArray)     

    });

    return () => unSubscribe();
  }
},[session?.data?.user?.email]);


const [formData, setFormData] = useState({
    company: '',
    contact: '',
    phone: '',
    address: '',
    email: getemail,
    description: '',
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
        const docRef = await addDoc(collection(db, 'strexSupplier'), {
            company: formData.company,
          description: formData.description,
          contact: formData.contact,
          phone: formData.phone,
          address: formData.address,
          email: getemail,
          role: 'supplier',
        });
        setAlert("block");
        console.log('Document written with ID: ', docRef.id);
        // session.user.newid = 23;
        // session.user.role = 'supplier';


        setTimeout(async function(){  
          await update({email: session?.data?.user?.email,name: session?.data?.user?.name,role: 'supplier'});
          window.location.href=mainurl+'/dashboard';
         }, 2000);
        
       
      } catch (e) {
        console.error('Error adding document: ', e);
      }
      
  };







//   async function handleEdit() {
        
//     // make a patch request to the endpint to update the user in database
    
//     // update the session 
//     const updateSession = await update({email: "update@gmail.com",name: "sandeep",role: "supplier"});
// }


  return (
    <main className="">
        {/* <button
                        onClick={handleEdit}
                    >
                        Edit detail
                    </button> */}
        {/* <Header/> */}

{/* 
        <Card  className="bg-white dark:bg-gray-900 bg-[url('https://flowbite.s3.amazonaws.com/docs/jumbotron/hero-pattern.svg')] dark:bg-[url('https://flowbite.s3.amazonaws.com/docs/jumbotron/hero-pattern-dark.svg')]">
        <h3 className="mb-4 mt-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900  dark:text-white">Add Supplier</h3>
    </Card> */}



<div className="mt-[40px]">
       <div className="company-logo text-center">
            <a href="https://perfexcrm.com/demo/" className="logo img-responsive">
        <img src="https://perfexcrm.com/demo/uploads/company/1f03e41865e3e0d535f6202e5fba391a.png" className="img-responsive" alt="Perfex CRM" />
        </a>        </div>

       <h1 className="  tw-text-2xl tw-text-neutral-800 text-center tw-font-semibold tw-mb-5 mb-10">
            Registeration        </h1>
    <Card  className="max-w-sm  center-card1  mt-[20px]">

    <Alert id="alert" style={{display:alert}} color="success">
      <span className="font-medium">Info alert!</span> Successfully save
    </Alert>

    <form onSubmit={handleSubmit} className="flex max-w-md flex-col gap-4">
    <div>
        <div className="mb-2 block">
          <Label htmlFor="company"   value="company"  />
          
        </div>
        <TextInput id="company" type="text" value={formData.company}
          onChange={handleChange} placeholder=""  required />
      </div>
      
      <div>
        <div className="mb-2 block">
          <Label htmlFor="contact"   value="Contact"  />
          
        </div>
        <TextInput id="contact" type="text" value={formData.contact}
          onChange={handleChange} placeholder=""  required />
      </div>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="phone" value="Phone" />
        </div>
        <TextInput id="phone"     value={formData.phone}   onChange={handleChange} type="text" required />
      </div>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="email" value="Email" />
        </div>
        <TextInput id="email"  value={getemail}
          onChange={handleChange} type="text" required readOnly />
      </div>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="description" value="description" />
        </div>
        <TextInput id="description"  value={formData.description}
          onChange={handleChange} type="text" required />
      </div>
      {/* <div className="flex items-center gap-2">
        <Checkbox id="remember" />
        <Label htmlFor="remember">Remember me</Label>
      </div> */}
      <Button type="submit">Save</Button>
    </form>
    </Card>
</div>











    {/* <Footer container>
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
    </Footer> */}

      {/* <h1 className="text-2xl dark:text-white">Flowbite React + Next.js</h1>
      <DarkThemeToggle /> */}
    </main>
  );
}
