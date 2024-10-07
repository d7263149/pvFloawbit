

"use client";
/* eslint-disable jsx-a11y/anchor-is-valid */
import {
  Alert,
    Breadcrumb,
    Button,
    Checkbox,
    Label,
    Modal,
    Table,
    TextInput,
  } from "flowbite-react";
  import type { FC } from "react";
  import { useEffect, useState } from "react";
  import {
    HiChevronLeft,
    HiChevronRight,
    HiCog,
    HiDocumentDownload,
    HiDotsVertical,
    HiExclamationCircle,
    HiHome,
    HiOutlineExclamationCircle,
    HiOutlinePencilAlt,
    HiPlus,
    HiTrash,
  } from "react-icons/hi";
  import NavbarSidebarLayout from "../NavbarSidebarLayout";
  import React from "react";
  import { db } from "../../../compnents/firebase"

  import { collection, getDocs, orderBy, query, onSnapshot, doc, where, limit, addDoc } from 'firebase/firestore'
  
  import {signOut, useSession} from 'next-auth/react'

  
  
  const UserListPage: FC = function () {
    const mainurl = process.env.NEXT_PUBLIC_URL;
    const session:any = useSession();
    const [alert, setAlert] = React.useState('none');
    const [getemail, setEmail] = React.useState('');
    
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
      session.user.role = 'supplier';


      setTimeout(function(){  
        window.location.href=mainurl+'/dashboard';
       }, 2000);
      
     
    } catch (e) {
      console.error('Error adding document: ', e);
    }
    
};


    return (
      <NavbarSidebarLayout isFooter={false}>
        <div className="flex mb-4 .content">
        <AddUserModal />
        {/* <Button color="primary" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-0 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" >
          <div className="flex items-center gap-x-3">
            <HiPlus className="text-xl" />
            Import Expenses
          </div>
        </Button> */}
        </div>
        <div className="block items-center justify-between border-b border-gray-200 bg-white  dark:border-gray-700 dark:bg-gray-800 sm:flex">
          <div className="mb-1 w-full">
            <div className="mb-4">
              {/* <Breadcrumb className="mb-4">
                <Breadcrumb.Item href="#">
                  <div className="flex items-center gap-x-3">
                    <HiHome className="text-xl" />
                    <span className="dark:text-white">Home</span>
                  </div>
                </Breadcrumb.Item>
                <Breadcrumb.Item >Suplier</Breadcrumb.Item>
                <Breadcrumb.Item>List</Breadcrumb.Item>
              </Breadcrumb> */}
              {/* <h1 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
                All Suplier
              </h1> */}
            </div>
            <div className="sm:flex">
              <div className="mb-3 hidden items-center dark:divide-gray-700 sm:mb-0 sm:flex sm:divide-x sm:divide-gray-100">
              
                <div className="mt-3 flex space-x-1 pl-0 sm:mt-0 sm:pl-2">
                  <a
                    href="#"
                    className="inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                  >
                    <span className="sr-only">Configure</span>
                    <HiCog className="text-2xl" />
                  </a>
                  <a
                    href="#"
                    className="inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                  >
                    <span className="sr-only">Delete</span>
                    <HiTrash className="text-2xl" />
                  </a>
                  <a
                    href="#"
                    className="inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                  >
                    <span className="sr-only">Purge</span>
                    <HiExclamationCircle className="text-2xl" />
                  </a>
                  <a
                    href="#"
                    className="inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                  >
                    <span className="sr-only">Settings</span>
                    <HiDotsVertical className="text-2xl" />
                  </a>
                </div>
              </div>
              <div className="ml-auto flex items-center space-x-2 sm:space-x-3">
                
                <Button color="gray">
                  <div className="flex items-center gap-x-3">
                    <HiDocumentDownload className="text-xl" />
                    <span>Export</span>
                  </div>
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden shadow">
                <AllUsersTable />
              </div>
            </div>
          </div>
        </div>
        {/* <Pagination /> */}
      </NavbarSidebarLayout>
    );
  };
  
  const AddUserModal: FC = function () {
    const [isOpen, setOpen] = useState(false);
  // ========================================


  const mainurl = process.env.NEXT_PUBLIC_URL;
  const session:any = useSession();
  const [alert, setAlert] = React.useState('none');
  const [getemail, setEmail] = React.useState('');
  
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
      email: formData.email,
      role: 'supplier',
    });
    setAlert("block");
    console.log('Document written with ID: ', docRef.id);
    // session.user.newid = 23;
    // session.user.role = 'supplier';


    setTimeout(function(){  
      // window.location.href=mainurl+'/dashboard';
      setOpen(false)
     }, 2000);
    
   
  } catch (e) {
    console.error('Error adding document: ', e);
  }
  
};

  // ==========================
    return (
      <>
        <Button color="primary" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-0 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" onClick={() => setOpen(true)}>
          <div className="flex items-center gap-x-3">
            <HiPlus className="text-xl" />
            Add Supplier
          </div>
        </Button>
        <Modal onClose={() => setOpen(false)} show={isOpen}>
        <form onSubmit={handleSubmit} className="">
          <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
            <strong>Add new Supplier</strong>
          </Modal.Header>
          <Modal.Body>
          <Alert id="alert" style={{display:alert}} color="success">
      <span className="font-medium">Info alert!</span> Successfully save
    </Alert>
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <Label htmlFor="firstName">company</Label>
                <div className="mt-1">
                <TextInput id="company" type="text" value={formData.company}
          onChange={handleChange} placeholder=""  required />
                </div>
              </div>
              
              
              
               <div>
                <Label htmlFor="firstName">Contact</Label>
                <div className="mt-1">
                <TextInput id="contact" type="text" value={formData.contact}
          onChange={handleChange} placeholder=""  required />
                </div>
              </div>


              <div>
                <Label htmlFor="firstName">Phone</Label>
                <div className="mt-1">
                <TextInput id="phone"     value={formData.phone}   onChange={handleChange} type="text" required />
                </div>
              </div>




              <div>
                <Label htmlFor="firstName">Email</Label>
                <div className="mt-1">
                <TextInput id="email"  value={formData.email}
          onChange={handleChange} type="text" required  />
                </div>
              </div>


            


         


              </div>
              <div className="mt-2">
                <Label htmlFor="firstName">Description</Label>
                <div className="mt-1">
                <TextInput id="description"  value={formData.description}
          onChange={handleChange} type="text" required />
                </div>
              </div>
   
     
    
   
      {/* <div className="flex items-center gap-2">
        <Checkbox id="remember" />
        <Label htmlFor="remember">Remember me</Label>
      </div> */}
    
   
          </Modal.Body>
          <Modal.Footer>
            <Button className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="submit" color="primary" >
              Add Supplier
            </Button>
          </Modal.Footer>
          </form>
          {/* onClick={() => setOpen(false)} */}
        </Modal>
      </>
    );
  };
  
  const AllUsersTable: FC = function () {
    //@ts-ignore
    const [data, setDogs] = React.useState<Dog[]>([]);
    
    useEffect(() => {
    
      // , where("mintType", "==", 'paid') 
       const dogsCol = query(collection(db, "strexSupplier"), limit(10));
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
          <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600 ">
            <Table.Head className="bg-gray-100 dark:bg-gray-700">
              <Table.HeadCell>
                <Label htmlFor="select-all" className="sr-only">
                  Select all
                </Label>
                <Checkbox id="select-all" name="select-all" />
              </Table.HeadCell>
              <Table.HeadCell>Company</Table.HeadCell>
              <Table.HeadCell>Contact</Table.HeadCell>
              <Table.HeadCell>Phone</Table.HeadCell>
              <Table.HeadCell>Address</Table.HeadCell>
              <Table.HeadCell>description</Table.HeadCell>
              {/* <Table.HeadCell>email</Table.HeadCell> */}
              {/* <Table.HeadCell>Country</Table.HeadCell> */}
              {/* <Table.HeadCell>Status</Table.HeadCell> */}
              <Table.HeadCell>Actions</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
    
    
    
            {data.map(item => (
              <Table.Row key={item.id} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                <Table.Cell className="w-4 p-4">
                  <div className="flex items-center">
                    <Checkbox aria-describedby="checkbox-1" id="checkbox-1" />
                    <label htmlFor="checkbox-1" className="sr-only">
                      checkbox
                    </label>
                  </div>
                </Table.Cell>
                <Table.Cell className="mr-12 flex items-center space-x-6 whitespace-nowrap p-4 lg:mr-0">
                  <img
                    className="h-10 w-10 rounded-full"
                    src="/images/neil-sims.png"
                    alt="Neil Sims avatar"
                  />
                  <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
                    <div className="text-base font-semibold text-gray-900 dark:text-white">
                    {item?.company}
                    </div>
                    <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
                    {item?.email}
                    </div>
                  </div>
                </Table.Cell>

                <Table.Cell className="whitespace-nowrap p-4 text-base font-normal text-gray-900 dark:text-white">
                  <div className="flex items-center">
                  {item?.contact}
                  </div>
                </Table.Cell>
                <Table.Cell className="whitespace-nowrap p-4 text-base font-normal text-gray-900 dark:text-white">
                  <div className="flex items-center">
                  {item?.phone}
                  </div>
                </Table.Cell>
                <Table.Cell className="whitespace-nowrap p-4 text-base font-normal text-gray-900 dark:text-white">
                  <div className="flex items-center">
                  {item?.address}
                  </div>
                </Table.Cell>
                <Table.Cell className="whitespace-nowrap p-4 text-base font-normal text-gray-900 dark:text-white">
                  <div className="flex items-center">
                  {item?.description}
                  </div>
                </Table.Cell>


               
                {/* <Table.Cell className="whitespace-nowrap p-4 text-base font-normal text-gray-900 dark:text-white">
                  <div className="flex items-center">
                    <div className="mr-2 h-2.5 w-2.5 rounded-full bg-green-400"></div>{" "}
                    Active
                  </div>
                </Table.Cell> */}
                <Table.Cell>
                  <div className="flex items-center gap-x-3 whitespace-nowrap">
                    <EditUserModal />
                    <DeleteUserModal />
                  </div>
                </Table.Cell>
              </Table.Row>
              ))}
             
             
              
            </Table.Body>
          </Table>
        );
      };
      
  
  const EditUserModal: FC = function () {
    const [isOpen, setOpen] = useState(false);
  
    return (
      <>
        <Button color="primary" onClick={() => setOpen(true)}>
          <div className="flex items-center gap-x-2">
            <HiOutlinePencilAlt className="text-lg" />
            Edit
          </div>
        </Button>
        <Modal onClose={() => setOpen(false)} show={isOpen}>
          <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
            <strong>Edit</strong>
          </Modal.Header>
          <Modal.Body>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <Label htmlFor="firstName">First name</Label>
                <div className="mt-1">
                  <TextInput
                    id="firstName"
                    name="firstName"
                    placeholder="Bonnie"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="lastName">Last name</Label>
                <div className="mt-1">
                  <TextInput id="lastName" name="lastName" placeholder="Green" />
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <div className="mt-1">
                  <TextInput
                    id="email"
                    name="email"
                    placeholder="example@company.com"
                    type="email"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="phone">Phone number</Label>
                <div className="mt-1">
                  <TextInput
                    id="phone"
                    name="phone"
                    placeholder="e.g., +(12)3456 789"
                    type="tel"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="department">Department</Label>
                <div className="mt-1">
                  <TextInput
                    id="department"
                    name="department"
                    placeholder="Development"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="company">Company</Label>
                <div className="mt-1">
                  <TextInput
                    id="company"
                    name="company"
                    placeholder="Somewhere"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="passwordCurrent">Current password</Label>
                <div className="mt-1">
                  <TextInput
                    id="passwordCurrent"
                    name="passwordCurrent"
                    placeholder="••••••••"
                    type="password"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="passwordNew">New password</Label>
                <div className="mt-1">
                  <TextInput
                    id="passwordNew"
                    name="passwordNew"
                    placeholder="••••••••"
                    type="password"
                  />
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button color="primary" onClick={() => setOpen(false)}>
              Save all
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  };
  
  const DeleteUserModal: FC = function () {
    const [isOpen, setOpen] = useState(false);
  
    return (
      <>
        <Button color="failure" onClick={() => setOpen(true)}>
          <div className="flex items-center gap-x-2">
            <HiTrash className="text-lg" />
            Delete 
          </div>
        </Button>
        <Modal onClose={() => setOpen(false)} show={isOpen} size="md">
          <Modal.Header className="px-6 pt-6 pb-0">
            <span className="sr-only">Delete </span>
          </Modal.Header>
          <Modal.Body className="px-6 pt-0 pb-6">
            <div className="flex flex-col items-center gap-y-6 text-center">
              <HiOutlineExclamationCircle className="text-7xl text-red-500" />
              <p className="text-xl text-gray-500">
                Are you sure you want to delete this user?
              </p>
              <div className="flex items-center gap-x-3">
                <Button color="failure" onClick={() => setOpen(false)}>
                  Yes, I'm sure
                </Button>
                <Button color="gray" onClick={() => setOpen(false)}>
                  No, cancel
                </Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </>
    );
  };
  
  // export const Pagination: FC = function () {
  //   return (
  //     <div className="sticky right-0 bottom-0 w-full items-center border-t border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 sm:flex sm:justify-between">
  //       <div className="mb-4 flex items-center sm:mb-0">
  //         <a
  //           href="#"
  //           className="inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
  //         >
  //           <span className="sr-only">Previous page</span>
  //           <HiChevronLeft className="text-2xl" />
  //         </a>
  //         <a
  //           href="#"
  //           className="mr-2 inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
  //         >
  //           <span className="sr-only">Next page</span>
  //           <HiChevronRight className="text-2xl" />
  //         </a>
  //         <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
  //           Showing&nbsp;
  //           <span className="font-semibold text-gray-900 dark:text-white">
  //             1-20
  //           </span>
  //           &nbsp;of&nbsp;
  //           <span className="font-semibold text-gray-900 dark:text-white">
  //             2290
  //           </span>
  //         </span>
  //       </div>
  //       <div className="flex items-center space-x-3">
  //         <a
  //           href="#"
  //           className="inline-flex flex-1 items-center justify-center rounded-lg bg-primary-700 py-2 px-3 text-center text-sm font-medium text-white hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
  //         >
  //           <HiChevronLeft className="mr-1 text-base" />
  //           Previous
  //         </a>
  //         <a
  //           href="#"
  //           className="inline-flex flex-1 items-center justify-center rounded-lg bg-primary-700 py-2 px-3 text-center text-sm font-medium text-white hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
  //         >
  //           Next
  //           <HiChevronRight className="ml-1 text-base" />
  //         </a>
  //       </div>
  //     </div>
  //   );
  // };
  
  export default UserListPage;
  