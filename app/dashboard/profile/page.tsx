

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

  import { addDoc, collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { useSession } from "next-auth/react";
  
  
  const UserListPage: FC = function () {
    return (
      <NavbarSidebarLayout isFooter={false}>
      
        <div className="flex flex-col mt-2">
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
    byemail: 'admin',
  name: '',
  cost: '',
  duration: '',
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
      const docRef = await addDoc(collection(db, 'strexService'), {
        name: formData.name,
        description: formData.description,
        phone: formData.cost,
        duration: formData.duration,
        byemail: formData.byemail,
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
           Save
          </div>
        </Button>
        <Modal onClose={() => setOpen(false)} show={isOpen}>
        <form onSubmit={handleSubmit} className="">
          <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
            <strong>Add new Service</strong>
          </Modal.Header>
          <Modal.Body>
          <Alert id="alert" style={{display:alert}} color="success">
      <span className="font-medium">Info alert!</span> Successfully save
    </Alert>
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <Label htmlFor="firstName">name</Label>
                <div className="mt-1">
                <TextInput id="name" type="text" value={formData.name}
          onChange={handleChange} placeholder=""  required />
                </div>
              </div>
              
              
              
               <div>
                <Label htmlFor="firstName">Cost</Label>
                <div className="mt-1">
                <TextInput id="cost" type="text" value={formData.cost}
          onChange={handleChange} placeholder=""  required />
                </div>
              </div>


              <div>
                <Label htmlFor="firstName">Duration</Label>
                <div className="mt-1">
                <TextInput id="duration"     value={formData.duration}   onChange={handleChange} type="text" required />
                </div>
              </div>




              <div className="mt-2">
                <Label htmlFor="firstName">Description</Label>
                <div className="mt-1">
                <TextInput id="description"  value={formData.description}
          onChange={handleChange} type="text" required />
                </div>
              </div>
    
         


              </div>
            
   
     
    
   
      {/* <div className="flex items-center gap-2">
        <Checkbox id="remember" />
        <Label htmlFor="remember">Remember me</Label>
      </div> */}
    
   
          </Modal.Body>
          <Modal.Footer>
            <Button className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="submit" color="primary" >
              Add Service
            </Button>
          </Modal.Footer>
          </form>
        </Modal>
      </>
    );
  };
  
  const AllUsersTable: FC = function () {
    const mainurl = process.env.NEXT_PUBLIC_URL;
    const session:any = useSession();
    const [alert, setAlert] = React.useState('none');
    const [profile, setProfile] = useState({
        name: '',
        email1: '',
        age: '',
        city: ''
      });
    
      const userId = 'ZHgZ9wwhUVadvOYQeISK'; // Replace with actual user ID or authentication logic
    
      // Fetch the profile data from Firestore when the component mounts
    //   useEffect(() => {
    //     const fetchProfile = async () => {
    //       const docRef = doc(db, 'strexSupplier', userId);
    //       const docSnap = await getDoc(docRef);
    //       console.log('docSnap',docSnap)
    //       if (docSnap.exists()) {
    //         setProfile(docSnap.data()); // Set profile data to state
    //       }
    //     };
    
    //     fetchProfile();
    //   }, []);

      useEffect(() => {
        const fetchProfile = async () => {
          try {
            const docRef = doc(db, 'strexSupplier', userId); // Reference to the user's profile document
            const docSnap = await getDoc(docRef); // Fetch the document
      
            if (docSnap.exists()) {
                console.log('docSnap.data()',docSnap.data())
                //@ts-ignore
              setProfile(docSnap.data()); // Set profile data if the document exists
            } else {
              console.log("No such document!"); // Handle case where the document doesn't exist
            }
          } catch (error) {
            console.error("Error fetching document: ", error); // Handle any errors that occur
          }
        };
      
        fetchProfile();
      }, []);
    
      // Handle input change
      const handleChange = (e: { target: { name: any; value: any; }; }) => {
        setProfile({
          ...profile,
          [e.target.name]: e.target.value
        });
      };
    
      // Save the profile to Firestore
      const handleSave = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        const docRef = doc(db, 'strexSupplier', userId);
        console.log('profile',profile)
        await setDoc(docRef, profile);
        setAlert('block')
        console.log('Profile saved successfully!');
      };
  
    // ==========================
    
        return (
            <form onSubmit={handleSave} className="">
            <div className="border-b border-gray-200 !p-6 dark:border-gray-700">
              <strong>Profile</strong>
            </div>
            <div>
            <Alert id="alert" style={{display:alert}} color="success">
        <span className="font-medium">Info alert!</span> Successfully save
      </Alert>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <Label htmlFor="firstName">name</Label>
                  <div className="mt-1">
                  <TextInput id="name" name="name" type="text" value={profile.name}
                  onChange={handleChange} placeholder=""  required />
                  </div>
                </div>
                
                
                
                 <div>
                  <Label htmlFor="firstName">Email</Label>
                  <div className="mt-1">
                  <TextInput id="cost" name="email1" type="text"  value={session?.data?.user?.email}
                  onChange={handleChange} placeholder=""  required  readOnly/>
                  </div>
                </div>
  
  
                <div>
                  <Label htmlFor="firstName">Age</Label>
                  <div className="mt-1">
                  <TextInput id="duration"      name="age"
                  value={profile.age}
                  onChange={handleChange} type="text" required />
                  </div>
                </div>
  
  
  
  
                <div className="mt-2">
                  <Label htmlFor="firstName">City</Label>
                  <div className="mt-1">
                  <TextInput id="description" name="city"   value={profile.city}
                  onChange={handleChange} type="text" required />
                  </div>
                </div>
      
           
  
  
                </div>
              
     
       
      
     
        {/* <div className="flex items-center gap-2">
          <Checkbox id="remember" />
          <Label htmlFor="remember">Remember me</Label>
        </div> */}
      
     
            </div>
            <div>
              <Button className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="submit" color="primary" >
                Save
              </Button>
            </div>
            </form>
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
  