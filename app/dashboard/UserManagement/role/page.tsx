

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
  import NavbarSidebarLayout from "../../NavbarSidebarLayout";
  import React from "react";
  import { db } from "../../../../compnents/firebase"
// ''''''''''''''''''''''''''''''

import {
    collection,
    getDocs,
    addDoc,
    doc,
    updateDoc,
    DocumentData,
    QuerySnapshot,
  } from 'firebase/firestore';
import { useSession } from "next-auth/react";
import { ToastContainer, toast } from 'react-toastify'; // Import Toast for notifications
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS
  
  // Define the type for permissions
  type Permissions = {
    viewDashboard?: boolean;
    editUsers?: boolean;
    manageSettings?: boolean;
    deletePosts?: boolean;
    editPosts?: boolean;
    publishPosts?: boolean;
    viewPosts?: boolean;
    commentOnPosts?: boolean;
  };
  
  // Define the type for a role
  interface Role {
    id: string; // Add id to identify the document in Firestore
    name: string;
    permissions: Permissions;
  }

// '''''''''''''''''''''''''''''
  
  const UserListPage: FC = function () {
    const mainurl = process.env.NEXT_PUBLIC_URL;
    const session:any = useSession();
    const [alert, setAlert] = React.useState('none');
    const [getemail, setEmail] = React.useState('');
    const [selectedOption, setSelectedOption] = useState('');

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
// ============================
const [roles, setRoles] = useState<Role[]>([]);
const [isModalOpen, setIsModalOpen] = useState(false);
const [isEditing, setIsEditing] = useState(false); // To determine if we're editing
const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null); // For editing
const [newRoleName, setNewRoleName] = useState('');
const [newRolePermissions, setNewRolePermissions] = useState<Permissions>({
  viewDashboard: false,
  editUsers: false,
  manageSettings: false,
  deletePosts: false,
  editPosts: false,
  publishPosts: false,
  viewPosts: false,
  commentOnPosts: false,
});

// Fetch roles from Firestore on component mount
useEffect(() => {
  const fetchRoles = async () => {
    const rolesCollection = collection(db, 'strexRoles'); // Reference to the Firestore 'roles' collection
    const roleDocs: QuerySnapshot<DocumentData> = await getDocs(rolesCollection);
    const rolesData: Role[] = roleDocs.docs.map(doc => ({
      id: doc.id, // Using the document ID as the role ID
      name: doc.data().name,
      permissions: doc.data().permissions || {}, // Safely access permissions
    }));
    setRoles(rolesData);
  };

  fetchRoles();
}, []);

// Handle permission change
const handlePermissionChange = (roleIndex: number, permission: keyof Permissions) => {
  const updatedRoles = roles.map((role, index) => {
    if (index === roleIndex) {
      return {
        ...role,
        permissions: {
          ...role.permissions,
          [permission]: !role.permissions[permission],
        },
      };
    }
    return role;
  });
  setRoles(updatedRoles);
};

// Toggle the modal open/close
const toggleModal = () => {
  setIsModalOpen(!isModalOpen);
  // Reset new role state when closing the modal
  if (isModalOpen) {
    resetForm();
  }
};

// Reset the form
const resetForm = () => {
  setNewRoleName('');
  setNewRolePermissions({
    viewDashboard: false,
    editUsers: false,
    manageSettings: false,
    deletePosts: false,
    editPosts: false,
    publishPosts: false,
    viewPosts: false,
    commentOnPosts: false,
  });
  setIsEditing(false);
  setSelectedRoleId(null);
};

// Handle creating a new role and saving to Firestore
const handleAddRole = async () => {
  if (newRoleName) {
    const newRole: Role = {
      id: '', // This will be set when added to Firestore
      name: newRoleName,
      permissions: newRolePermissions,
    };
    const docRef = await addDoc(collection(db, 'strexRoles'), newRole); // Add new role to Firestore
    setRoles([...roles, { ...newRole, id: docRef.id }]); // Update local state with the new role ID
    toast.success('Role added successfully!');
    toggleModal(); // Close the modal after adding the role
  }
};

// Handle editing an existing role
const handleEditRole = async () => {
  if (selectedRoleId && newRoleName) {
    const updatedRole: Role = {
      id: selectedRoleId,
      name: newRoleName,
      permissions: newRolePermissions,
    };

    // Update the role in Firestore
    await updateDoc(doc(db, 'strexRoles', selectedRoleId), {
      name: newRoleName,
      permissions: newRolePermissions,
    });

    // Update the local state
    setRoles(roles.map(role => (role.id === selectedRoleId ? updatedRole : role)));
    toast.success('Role updated successfully!');
    toggleModal(); // Close the modal after updating the role
  }
};

// Handle opening the edit modal
const openEditModal = (role: Role) => {
  setNewRoleName(role.name);
  setNewRolePermissions(role.permissions);
  setSelectedRoleId(role.id);
  setIsEditing(true);
  setIsModalOpen(true);
};

// Handle permission toggle in the modal
const handleNewPermissionChange = (permission: keyof Permissions) => {
  setNewRolePermissions((prevPermissions) => ({
    ...prevPermissions,
    [permission]: !prevPermissions[permission],
  }));
};




////////////////////////////////

    return (
      <NavbarSidebarLayout isFooter={false}>

<div className="flex mb-4 .content  ">
        {/* <AddUserModal /> */}
        <Button color="primary" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-0 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" onClick={toggleModal}>
          <div className="flex items-center gap-x-3">
            <HiPlus className="text-xl" />
            Add Role
          </div>
        </Button>
        {/* <Button color="primary" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-0 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" >
          <div className="flex items-center gap-x-3">
            <HiPlus className="text-xl" />
            Import Expenses
          </div>
        </Button> */}
        </div>
        {/* <div className="flex flex-col">
        <Button color="primary" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-0 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" onClick={toggleModal}>
          <div className="flex items-center gap-x-3">
            <HiPlus className="text-xl" />
            Add User
          </div>
        </Button> */}
          {/* <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden shadow"> */}
















               {/* ===================== */}
               <div className=" mx-auto  white-bg pt-6 pb-6 pl-2 pr-2 rounded-lg">

               <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
            {/* Page Header */}
            {/* <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Role Management</h2>
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                onClick={toggleModal}
              >
                Add Role
              </button>
            </div>
       */}
            {/* Role List */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {roles.map((role, roleIndex) => (
                <div key={role.id} className="bg-white shadow-md rounded-lg p-4 capitalize">
                  <h3 className="text-lg font-bold mb-3">{role.name}</h3>
                  <ul className="space-y-2">
                    {Object.keys(role.permissions).map((permission) => (
                      <li key={permission} className="flex justify-between">
                        <span>{permission.split(/(?=[A-Z])/).join(' ')}</span>
                        <input
                          type="checkbox"
                          className="form-checkbox h-5 w-5 text-blue-600"
                          checked={role.permissions[permission as keyof Permissions] || false}
                          onChange={() => handlePermissionChange(roleIndex, permission as keyof Permissions)}
                        />
                      </li>
                    ))}
                  </ul>
                  <button
                    className="mt-2 text-blue-500 underline"
                    onClick={() => openEditModal(role)}
                  >
                    Edit
                  </button>
                </div>
              ))}
            </div>
      
            {/* Modal for adding or editing a role */}
            {isModalOpen && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-96 capitalize">
                  <h3 className="text-lg font-bold mb-4">{isEditing ? 'Edit Role' : 'Add New Role'}</h3>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Role Name</label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded"
                      value={newRoleName}
                      onChange={(e) => setNewRoleName(e.target.value)}
                    />
                  </div>
      
                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-2">Permissions</h4>
                    {Object.keys(newRolePermissions).map((permission) => (
                      <div key={permission} className="flex justify-between mb-2">
                        <span>{permission.split(/(?=[A-Z])/).join(' ')}</span>
                        <input
                          type="checkbox"
                          className="form-checkbox h-5 w-5 text-blue-600"
                          checked={newRolePermissions[permission as keyof Permissions] || false}
                          onChange={() => handleNewPermissionChange(permission as keyof Permissions)}
                        />
                      </div>
                    ))}
                  </div>
      
                  <div className="flex justify-end">
                    <button
                      className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded mr-2"
                      onClick={toggleModal}
                    >
                      Cancel
                    </button>
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                      onClick={isEditing ? handleEditRole : handleAddRole}
                    >
                      {isEditing ? 'Save Changes' : 'Add Role'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>









               {/* =================================== */}
              {/* </div>
            </div>
          </div>
        </div> */}
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
  const [selectedOption, setSelectedOption] = useState('customer');

const [formData, setFormData] = useState({
company: '',
role: selectedOption,
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
        name: formData.company,
        address: formData.description,
      phone: formData.phone,
      email: formData.email,
      role: selectedOption,
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

const handleSelectChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setSelectedOption(event.target.value);
  };
  

  // ==========================
    return (
      <>
        <Button color="primary" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-0 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" onClick={() => setOpen(true)}>
          <div className="flex items-center gap-x-3">
            <HiPlus className="text-xl" />
            Add User
          </div>
        </Button>
        <Modal onClose={() => setOpen(false)} show={isOpen}>
        <form onSubmit={handleSubmit} className="">
          <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
            <strong>Add new User</strong>
          </Modal.Header>
          <Modal.Body>
          <Alert id="alert" style={{display:alert}} color="success">
      <span className="font-medium">Info alert!</span> Successfully save
    </Alert>
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <Label htmlFor="firstName">Name</Label>
                <div className="mt-1">
                <TextInput id="company" type="text" value={formData.company}
          onChange={handleChange} placeholder=""  required />
                </div>
              </div>
              
              
              
               <div>
                <Label htmlFor="firstName">Role</Label>
                <div className="mt-1">
                {/* <TextInput id="contact" type="text" value={formData.contact}
          onChange={handleChange} placeholder=""  required /> */}
            {/* <label htmlFor="options">Choose an option:</label> */}
      <select id="options" value={selectedOption} onChange={handleSelectChange}>
        <option value="">--Please choose an option--</option>
        <option value="customer">customer</option>
        <option value="supplier">Supplier</option>
      </select>
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
                <Label htmlFor="firstName">address</Label>
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
              Add User
            </Button>
          </Modal.Footer>
          </form>
          {/* onClick={() => setOpen(false)} */}
        </Modal>
      </>
    );
  };
  
  const AllUsersTable: FC = function () {

 

        return (
           <></>
        )
    }
      
  
  const EditUserModal: FC = function () {
    const [isOpen, setOpen] = useState(false);
  
    return (
      <>
        <Button color="primary" onClick={() => setOpen(true)}>
          <div className="flex items-center gap-x-2">
            <HiOutlinePencilAlt className="text-lg" />
            
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
  