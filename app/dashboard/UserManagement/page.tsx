

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

//   import { collection, getDocs, orderBy, query, onSnapshot, doc, where, limit, addDoc } from 'firebase/firestore'
  
  import {signOut, useSession} from 'next-auth/react'
  import { useTable } from 'react-table';

//   ---------------------------------------------------------
import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    DocumentData,
    QuerySnapshot,
  } from 'firebase/firestore';
  
  interface User {
    id: string;
    name: string;
    roleId: string;
    phone: string;
    address: string;
    password: string; // Added password field
  }
  
  interface Role {
    id: string;
    name: string;
  }
//   ===============================================
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
      const docRef = await addDoc(collection(db, 'strexUsers'), {
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


//   [[[[[[[[[[[[[[[[[[[[]]]]]]]]]]]]]]]]]]]]
const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [newUserData, setNewUserData] = useState<Omit<User, 'id'>>({
    name: '',
    roleId: '',
    phone: '',
    address: '',
    password: '', // Initialize password
  });
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState<boolean>(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollection = collection(db, 'strexUsers');
      const userDocs: QuerySnapshot<DocumentData> = await getDocs(usersCollection);
      const usersData: User[] = userDocs.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name,
        roleId: doc.data().roleId,
        phone: doc.data().phone,
        address: doc.data().address,
        password: doc.data().password || '', // Fetch password as well
      }));
      setUsers(usersData);
    };

    const fetchRoles = async () => {
      const rolesCollection = collection(db, 'roles');
      const roleDocs: QuerySnapshot<DocumentData> = await getDocs(rolesCollection);
      const rolesData: Role[] = roleDocs.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name,
      }));
      setRoles(rolesData);
    };

    fetchUsers();
    fetchRoles();
  }, []);

  const toggleModal = () => {
    setIsModalOpen(prev => !prev);
    if (isModalOpen) {
      resetForm();
    }
  };

  const resetForm = () => {
    setNewUserData({
      name: '',
      roleId: '',
      phone: '',
      address: '',
      password: '', // Reset password
    });
    setIsEditing(false);
    setSelectedUserId(null);
  };

  const handleAddUser = async () => {
    if (newUserData.name && newUserData.roleId) {
      const userData: User = {
        id: '',
        ...newUserData,
      };
      const docRef = await addDoc(collection(db, 'strexUsers'), userData);
      setUsers([...users, { ...userData, id: docRef.id }]);
      toggleModal();
    }
  };

  const handleEditUser = async () => {
    if (selectedUserId) {
      await updateDoc(doc(db, 'strexUsers', selectedUserId), newUserData);
      setUsers(users.map(user => (user.id === selectedUserId ? { ...user, ...newUserData } : user)));
      toggleModal();
    }
  };

  const openDeleteConfirm = (userId: string) => {
    setUserToDelete(userId);
    setIsDeleteConfirmOpen(true);
  };

  const handleDeleteUser = async () => {
    if (userToDelete) {
      await deleteDoc(doc(db, 'strexUsers', userToDelete));
      setUsers(users.filter(user => user.id !== userToDelete));
      setIsDeleteConfirmOpen(false);
      setUserToDelete(null);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewUserData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Prepare data for the react-table
  const data = React.useMemo(() => users.map(user => ({
    ...user,
    roleName: roles.find(role => role.id === user.roleId)?.name || 'Unknown',
  })), [users, roles]);

  const columns = React.useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'name',
      },
      {
        Header: 'Role',
        accessor: 'roleName', // Display role name
      },
      {
        Header: 'Phone',
        accessor: 'phone',
      },
      {
        Header: 'Address',
        accessor: 'address',
      },
      {
        Header: 'Actions',
        Cell: ({ row }: { row: { original: User } }) => (
          <div className="flex space-x-2">
            <button
              className="text-blue-500 hover:text-blue-600"
              onClick={() => {
                setNewUserData(row.original);
                setSelectedUserId(row.original.id);
                setIsEditing(true);
                toggleModal();
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l6.105-6.104a2 2 0 00-2.828-2.828l-6.105 6.104a3 3 0 00-1.568.723l-4.44 4.44a2 2 0 00-.464.706l-1.23 3.691a1 1 0 001.245 1.246l3.691-1.23a2 2 0 00.706-.464l4.44-4.44a3 3 0 00.723-1.568z" />
              </svg>
            </button>
            <button
              className="text-red-500 hover:text-red-600"
              onClick={() => openDeleteConfirm(row.original.id)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ),
      },
    ],
    [users, roles]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data });
    // [[[[[[[[[[[[[[[[[[[[[[[[]]]]]]]]]]]]]]]]]]]]]]]]










    return (
      <NavbarSidebarLayout isFooter={false}>
        <div className="flex mb-4 .content  ">
        {/* <AddUserModal /> */}
        <Button color="primary" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-0 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" onClick={toggleModal}>
          <div className="flex items-center gap-x-3">
            <HiPlus className="text-xl" />
            Add User
          </div>
        </Button>
        {/* <Button color="primary" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-0 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" >
          <div className="flex items-center gap-x-3">
            <HiPlus className="text-xl" />
            Import Expenses
          </div>
        </Button> */}
        </div>
    










{/* ---------------------------- */}

<div className="container mx-auto  white-bg pt-6 pb-6 pl-2 pr-2 rounded-lg	">



      {/* <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">User Management</h2>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow"
          onClick={toggleModal}
        >
          Add User
        </button>
      </div> */}

      <div className="overflow-x-auto">
        <table {...getTableProps()} className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
          <thead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()} className="bg-gray-200">
                {headerGroup.headers.map(column => (
                  <th {...column.getHeaderProps()} className="py-2 px-4 border-b text-left">
                    {column.render('Header')}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map(row => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} className="border-b hover:bg-gray-100 transition">
                  {row.cells.map(cell => (
                    <td {...cell.getCellProps()} className="py-2 px-4">
                      {cell.render('Cell')}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal for Adding/Editing User */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-1/3">
            <h3 className="text-lg font-semibold mb-4">{isEditing ? 'Edit User' : 'Add User'}</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={newUserData.name}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                placeholder="Enter user name"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <select
                name="roleId"
                value={newUserData.roleId}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              >
                <option value="">Select Role</option>
                {roles.map(role => (
                  <option key={role.id} value={role.id}>{role.name}</option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="text"
                name="phone"
                value={newUserData.phone}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                placeholder="Enter phone number"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <input
                type="text"
                name="address"
                value={newUserData.address}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                placeholder="Enter address"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                name="password"
                value={newUserData.password}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                placeholder="Enter password"
              />
            </div>

            <div className="flex justify-end">
              <button
                className="bg-gray-300 hover:bg-gray-400 text-white px-4 py-2 rounded mr-2"
                onClick={toggleModal}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                onClick={isEditing ? handleEditUser : handleAddUser}
              >
                {isEditing ? 'Update User' : 'Add User'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-1/3">
            <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
            <p>Are you sure you want to delete this user?</p>
            <div className="flex justify-end mt-4">
              <button
                className="bg-gray-300 hover:bg-gray-400 text-white px-4 py-2 rounded mr-2"
                onClick={() => setIsDeleteConfirmOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                onClick={handleDeleteUser}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>

        {/* ----------------------------- */}
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
    const docRef = await addDoc(collection(db, 'strexUsers'), {
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
  