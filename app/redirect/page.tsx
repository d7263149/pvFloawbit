"use client";
import React, { useState } from "react";
import { Alert, Button, Card, Label, TextInput } from "flowbite-react";
import { Avatar, Dropdown, Navbar } from "flowbite-react";
import { DarkThemeToggle } from "flowbite-react";
import { Footer } from "flowbite-react";
import { Checkbox, Table } from "flowbite-react";
import { db } from "./../../compnents/firebase"
import Header from './../../compnents/header';
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




if (session && data.length) {
  const updateSession = await update({email: data?.[0]?.email,name: data?.[0]?.name,role: data?.[0]?.role});
  window.location.href=mainurl+'/dashboard';
}else{
    // setAlert('block')
    console.log('not register user');
}

}
console.log('data?.[0]?.role',data?.[0]?.role);
if(data?.[0]?.role){
   mains(data?.[0]?.role);
}else{
    setTimeout(function(){
        
        setAlert('block')

    },5000);
    
}
//



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









//   async function handleEdit() {
        
//     // make a patch request to the endpint to update the user in database
    
//     // update the session 
//     const updateSession = await update({email: "update@gmail.com",name: "sandeep",role: "supplier"});
// }


  return (
    <main className="main">
        
   

    {/* <Header/> */}
    <div className="mt-[40px]">
    <div className="company-logo text-center">
         {/* <a href="https://perfexcrm.com/demo/" className="logo img-responsive">
     <img src="/images/black.png" style={{    height: '62px'}} className="img-responsive" alt=" CRM" />
     </a>    */}
     
          </div>

    {/* <h2 style={{    fontSize: '22px'}} className="   tw-text-neutral-800 text-center tw-font-semibold tw-mb-5 mb-10">
         Login        </h2> */}

<Card className="max-w-sm  center-card1  mt-[40px]" style={{display: alert }}>
<div className="flex flex-col gap-4">
 

{/* <button onClick={()=>signIn('google')}>Login google </button> */}

    <p>Not register User Please Register First</p>

  <Button  color="dark" href={mainurl+'/login'}>login</Button>
  <Button  color="dark" href={mainurl+'/register'}>Register</Button>
</div>
</Card>
</div>
</main>
  );
}
