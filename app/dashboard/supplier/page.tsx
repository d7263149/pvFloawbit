

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


//   ---------------------------------------------------------

// import React, { useEffect, useState } from 'react';
import { useTable, useSortBy, usePagination, useGlobalFilter, Row } from 'react-table';
// import { db } from './firebase'; // Import your Firebase configuration
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  QuerySnapshot,
  DocumentData,
} from 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Supplier interface
interface Supplier {
  id: string;
  companyName: string;
  contact: string;
  phone: string;
  address: string;
  email: string;
  description: string;
  userId: string; // Reference to strexUsers
}

// User interface with role field
interface User {
  id: string;
  name: string;
  roleId: string; // Include roleId to match against strexRoles
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
const [suppliers, setSuppliers] = useState<Supplier[]>([]);
const [users, setUsers] = useState<User[]>([]); // Store users from strexUsers
const [roles, setRoles] = useState<Role[]>([]); // Store roles from strexRoles
const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
const [isEditing, setIsEditing] = useState<boolean>(false);
const [showSearch, setShowSearch] = useState<boolean>(false); // State for search box
const [pageSize, setPageSize] = useState<number>(10); // State for page size
const [selectedSupplierId, setSelectedSupplierId] = useState<string | null>(null);
const [newSupplierData, setNewSupplierData] = useState<Omit<Supplier, 'id'>>({
  companyName: '',
  contact: '',
  phone: '',
  address: '',
  email: '',
  description: '',
  userId: '', // UserId reference
});
const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState<boolean>(false);
const [supplierToDelete, setSupplierToDelete] = useState<string | null>(null);
const [supplierRoleId, setSupplierRoleId] = useState<string | null>(null); // Role ID for Supplier

// Fetch suppliers, users, and roles from Firebase
useEffect(() => {
  const fetchData = async () => {
    // Fetch roles from strexRoles collection
    const rolesCollection = collection(db, 'strexRoles');
    const rolesDocs: QuerySnapshot<DocumentData> = await getDocs(rolesCollection);
    const rolesData: Role[] = rolesDocs.docs.map(doc => ({
      id: doc.id,
      name: doc.data().name,
    }));
    setRoles(rolesData);

    // Find Supplier role ID
    const supplierRole = rolesData.find(role => role.name === 'supplier');
    if (supplierRole) {
      setSupplierRoleId(supplierRole.id); // Store the Supplier role ID
    }

    // Fetch users from strexUsers collection
    const usersCollection = collection(db, 'strexUsers');
    const userDocs: QuerySnapshot<DocumentData> = await getDocs(usersCollection);
    const usersData: User[] = userDocs.docs.map(doc => ({
      id: doc.id,
      name: doc.data().name,
      roleId: doc.data().roleId, // Get the roleId of the user
    }));
    setUsers(usersData);

    // Fetch suppliers from strexSuppliers collection
    const suppliersCollection = collection(db, 'strexSuppliers');
    const supplierDocs: QuerySnapshot<DocumentData> = await getDocs(suppliersCollection);
    const suppliersData: Supplier[] = supplierDocs.docs.map(doc => ({
      id: doc.id,
      companyName: doc.data().companyName,
      contact: doc.data().contact,
      phone: doc.data().phone,
      address: doc.data().address,
      email: doc.data().email,
      description: doc.data().description,
      userId: doc.data().userId, // UserId reference
    }));
    setSuppliers(suppliersData);
  };

  fetchData();
}, []);

// Toggle Modal
const toggleModal = () => {
  setIsModalOpen(prev => !prev);
  if (isModalOpen) {
    resetForm();
  }
};

const resetForm = () => {
  setNewSupplierData({
    companyName: '',
    contact: '',
    phone: '',
    address: '',
    email: '',
    description: '',
    userId: '', // Reset the userId
  });
  setIsEditing(false);
  setSelectedSupplierId(null);
};

// Add Supplier
const handleAddSupplier = async () => {
  if (newSupplierData.companyName && newSupplierData.userId) {
    const supplierData: Supplier = {
      id: '',
      ...newSupplierData,
    };

    // Ensure the user does not have another supplier assigned
    const assignedSupplier = suppliers.find(supplier => supplier.userId === newSupplierData.userId);
    if (assignedSupplier) {
      toast.error('This user already has a supplier assigned!');
      return;
    }

    const docRef = await addDoc(collection(db, 'strexSuppliers'), supplierData);
    setSuppliers([...suppliers, { ...supplierData, id: docRef.id }]);
    toast.success('Supplier added successfully!');
    toggleModal();
  }
};

// Edit Supplier
const handleEditSupplier = async () => {
  if (selectedSupplierId && newSupplierData.userId) {
    // Ensure the user does not have another supplier assigned
    const assignedSupplier = suppliers.find(supplier => supplier.userId === newSupplierData.userId && supplier.id !== selectedSupplierId);
    if (assignedSupplier) {
      toast.error('This user already has a supplier assigned!');
      return;
    }

    await updateDoc(doc(db, 'strexSuppliers', selectedSupplierId), newSupplierData);
    setSuppliers(suppliers.map(supplier => (supplier.id === selectedSupplierId ? { ...supplier, ...newSupplierData } : supplier)));
    toast.success('Supplier updated successfully!');
    toggleModal();
  }
};

// Open delete confirmation
const openDeleteConfirm = (supplierId: string) => {
  setSupplierToDelete(supplierId);
  setIsDeleteConfirmOpen(true);
};

// Delete Supplier
const handleDeleteSupplier = async () => {
  if (supplierToDelete) {
    await deleteDoc(doc(db, 'strexSuppliers', supplierToDelete));
    setSuppliers(suppliers.filter(supplier => supplier.id !== supplierToDelete));
    toast.success('Supplier deleted successfully!');
    setIsDeleteConfirmOpen(false);
    setSupplierToDelete(null);
  }
};

// Handle input change
const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
  const { name, value } = e.target;
  setNewSupplierData(prevState => ({
    ...prevState,
    [name]: value,
  }));
};

// Prepare data for react-table
const data = React.useMemo(() => suppliers, [suppliers]);

// Define table columns
const columns = React.useMemo(
  () => [
    { Header: 'Company Name', accessor: 'companyName' },
    { Header: 'Contact', accessor: 'contact' },
    { Header: 'Phone', accessor: 'phone' },
    { Header: 'Address', accessor: 'address' },
    { Header: 'Email', accessor: 'email' },
    { Header: 'Description', accessor: 'description' },
    {
      Header: 'Assigned User',
      accessor: 'userId',
      Cell: ({ value }: { value: string }) => users.find(user => user.id === value)?.name || 'Unassigned',
    },
    {
      Header: 'Actions',
      Cell: ({ row }: { row: { original: Supplier } }) => (
        <div className="flex space-x-2">
          <button
            className="text-blue-500 hover:text-blue-600"
            onClick={() => {
              setNewSupplierData({
                companyName: row.original.companyName,
                contact: row.original.contact,
                phone: row.original.phone,
                address: row.original.address,
                email: row.original.email,
                description: row.original.description,
                userId: row.original.userId,
              });
              setSelectedSupplierId(row.original.id);
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
  [suppliers, users]
);

// useTable hooks
// const {
//   getTableProps,
//   getTableBodyProps,
//   headerGroups,
//   rows,
//   prepareRow,
//   page,
//   state: { pageIndex, pageSize },
//   canPreviousPage,
//   canNextPage,
//   previousPage,
//   nextPage,
//   setPageSize,//@ts-ignore
//   setGlobalFilter, //@ts-ignore
// } = useTable(
//   {
//     columns,
//     data,
//     initialState: { pageSize: 10 },
//   },
//   useGlobalFilter,
//   useSortBy,
//   usePagination
// );


const {
  getTableProps,
  getTableBodyProps,
  headerGroups,
  rows,
  prepareRow, //@ts-ignore
  page, //@ts-ignore
  canPreviousPage, //@ts-ignore
  canNextPage, //@ts-ignore
  pageOptions, //@ts-ignore
  gotoPage, //@ts-ignore
  nextPage, //@ts-ignore
  previousPage, //@ts-ignore
  setGlobalFilter, //@ts-ignore
  state: { pageIndex, globalFilter },
} = useTable(
  { //@ts-ignore
    columns,
    data, //@ts-ignore
    initialState: { pageIndex: 0, pageSize: 10 }, // Set initial page index and page size
  },
  useGlobalFilter, // Search
  useSortBy, // Sorting
  usePagination // Pagination
);

// Get available users who are not already assigned and have the Supplier role
console.log('users',users);
const availableUsers = users.filter(user => 
  user.roleId === supplierRoleId && !suppliers.some(supplier => supplier.userId === user.id)
);

    // [[[[[[[[[[[[[[[[[[[[[[[[]]]]]]]]]]]]]]]]]]]]]]]]










    return (
      <NavbarSidebarLayout isFooter={false}>
      <div className="flex mb-4 .content  ">
      {/* <AddUserModal /> */}
      <Button color="primary" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-0 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"  onClick={() => {
          resetForm();
          toggleModal();
        }}>
        <div className="flex items-center gap-x-3">
          <HiPlus className="text-xl" />
          Add Supplier
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

<div className=" mx-auto  white-bg pt-6 pb-6 pl-2 pr-2 rounded-lg	">
{/* <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">User Management</h2>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => {
            resetForm();
            toggleModal();
          }}
        >
          Add User
        </button>
      </div> */}

<ToastContainer position="top-right" autoClose={3000} hideProgressBar />

{/* Top Toolbar */}
<div className="flex justify-between items-center mb-4">
  {/* Left side: Number of rows dropdown */}
  <div className="flex items-center space-x-2">
    <label className="text-sm font-medium">Show</label>
    <select
      className="border border-gray-300 rounded-md p-1"
      value={pageSize}
      onChange={e => setPageSize(Number(e.target.value))}
    >
      {[10, 25, 50].map(size => (
        <option key={size} value={size}>
          {size}
        </option>
      ))}
    </select>
    <label className="text-sm font-medium">entries</label>
  </div>

  {/* Right side: Search box */}
  <div className="relative"  style={{marginTop: '-33px'
        }}>
    {/* <button onClick={() => setShowSearch(prev => !prev)} className="text-gray-500 hover:text-gray-600">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-5.5 5.5m-1.25-1.25a6 6 0 118.5 0l-1.25 1.25M10.5 5.5a6 6 0 118.5 8.5" />
      </svg>
      
    </button> */}
     
     <input
        type="text"
        className="absolute top-0 right-0 w-20 md:w-40  border border-gray-300 rounded-md p-1 transition-all duration-300"
        value={globalFilter || ''}
        onChange={e => setGlobalFilter(e.target.value)}
        placeholder="Search"
        onFocus={(e) => e.target.classList.add('w-40')}
       
      />

    {showSearch && (
      <input
        type="text"
        className="absolute top-0 right-0 w-20 md:w-40 mt-2 border border-gray-300 rounded-md p-1 transition-all duration-300"
        value={globalFilter || ''}
        onChange={e => setGlobalFilter(e.target.value)}
        placeholder="Search"
        onFocus={(e) => e.target.classList.add('w-40')}
      />
    )}
  </div>
</div>



{/* 
 <tr {...headerGroup.getHeaderGroupProps()}>
        {headerGroup.headers.map(column => (
          <th {...column.getHeaderProps()} className="border-b p-2 text-left">
            {column.render('Header')}
          </th>
        ))}
      </tr> */}
  {/* <tbody {...getTableBodyProps()}>
    {page.map(row => {
      prepareRow(row);
      return (
        <tr {...row.getRowProps()} className="border-b hover:bg-gray-100">
          {row.cells.map(cell => (
            <td {...cell.getCellProps()} className="p-2">
              {cell.render('Cell')}
            </td>
          ))}
        </tr>
      );
    })}
  </tbody> */}


{/* Table */}
<div className="relative overflow-x-auto border rounded-lg">
<table {...getTableProps()} className="min-w-full leading-normal">
  <thead>
    {headerGroups.map(headerGroup => (
        <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup?.id}>
        {headerGroup.headers.map(column => ( //@ts-ignore
          <th //@ts-ignore
            {...column.getHeaderProps(column.getSortByToggleProps())}
            className="px-5 py-3 border-b-2 bg-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"  key={column?.id}
          >
            {column.render('Header') }
            <span>{ 
             //@ts-ignore
            column.isSorted ? (column.isSortedDesc ? ' ▼' : ' ▲') : ''}</span>
          </th>
        ))}
      </tr>
    ))}
  </thead>
  <tbody {...getTableBodyProps()}>
            {page.map((row: Row<Supplier>) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}  className={"hover:bg-gray-100 row"+row.id} key={row?.id}>
                  {row.cells.map(cell => (
                    <td {...cell.getCellProps()} className="px-5 py-2 border-b text-sm" key={row?.id}>
                      {cell.render('Cell')}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
</table>
</div>

{/* Pagination */}
<div className="flex justify-between items-center mt-4">
  <div>
    <span>
      Showing {page.length} of {suppliers.length} entries
    </span>
  </div>
  <div className="flex space-x-2">
    <button onClick={() => previousPage()} disabled={!canPreviousPage}>
      Previous
    </button>
    <button onClick={() => nextPage()} disabled={!canNextPage}>
      Next
    </button>
  </div>
</div>

{/* Modal for Add/Edit Supplier */}
{isModalOpen && (
  <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
    <div className="bg-white rounded-lg shadow-lg p-6 w-1/3">
      {/* <h2 className="text-xl mb-4">{isEditing ? 'Edit Supplier' : 'Add Supplier'}</h2> */}
      <h3 className="text-lg font-semibold mb-4">{isEditing ? 'Edit Supplier' : 'Add Supplier'}</h3>
      <form onSubmit={e => { e.preventDefault(); isEditing ? handleEditSupplier() : handleAddSupplier(); }}>
      <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">company Name</label>
              <input type="text" name="companyName" value={newSupplierData.companyName} onChange={handleInputChange} placeholder="Company Name" required className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
      </div>

      <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">contact</label>
              <input type="text" name="contact" value={newSupplierData.contact} onChange={handleInputChange} placeholder="Contact" required className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
      </div>

      <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">phone</label>
              <input type="text" name="phone" value={newSupplierData.phone} onChange={handleInputChange} placeholder="Phone" required className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
      
      </div>

      <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <input type="text" name="address" value={newSupplierData.address} onChange={handleInputChange} placeholder="Address" required className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
      </div>

      <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" name="email" value={newSupplierData.email} onChange={handleInputChange} placeholder="Email" required className="mt-1 block w-full border border-gray-300 rounded-md p-2" />

      </div>

      <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea name="description" value={newSupplierData.description} onChange={handleInputChange} placeholder="Description" required className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
      </div>
      <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">User</label>
              <select name="userId" value={newSupplierData.userId} onChange={handleInputChange} required className="mt-1 block w-full border border-gray-300 rounded-md p-2">
          <option value="" disabled>Select User</option>
          {availableUsers.map(user => (
            <option key={user.id} value={user.id}>{user.name}</option>
          ))}
        </select>
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
              
              >
                {isEditing ? 'Update Supplier' : 'Add Supplier'}
              </button>
            </div>
        
        
        
        
        {/* <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded w-full">
          {isEditing ? 'Update Supplier' : 'Add Supplier'}
        </button> */}
      </form>
      {/* <button onClick={toggleModal} className="mt-4 text-red-500">Cancel</button> */}
    </div>
  </div>
)}

{/* Delete Confirmation Modal */}
{isDeleteConfirmOpen && (
  <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
    <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
      <h2 className="text-xl mb-4">Confirm Deletion</h2>
      <p>Are you sure you want to delete this supplier?</p>
      <div className="flex justify-between mt-4">
        <button onClick={handleDeleteSupplier} className="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
        <button onClick={() => setIsDeleteConfirmOpen(false)} className="text-gray-500 border px-4 py-2 rounded">Cancel</button>
      </div>
    </div>
  </div>
)}

<ToastContainer />
</div>
        {/* ----------------------------- */}
        {/* <Pagination /> */}
      </NavbarSidebarLayout>
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
  