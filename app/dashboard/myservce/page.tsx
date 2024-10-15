

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



import { useTable, useSortBy, usePagination, useGlobalFilter, Row } from 'react-table';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  DocumentData,
  QuerySnapshot,
  where,
  query,
  limit,
} from 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify'; // Import Toast for notifications
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS

interface User {
  id: string;
  name: string;
  description:string;
  category: string; // Added email field
  cost: string;
  address: string;
  status: string; // Added status field
  duration: string;
  image: string;
  by: string;
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




//   [[[[[[[[[[[[[[[[[[[[]]]]]]]]]]]]]]]]]]]]
const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [newUserData, setNewUserData] = useState<Omit<User, 'id'>>({
    name: '',
    description:'',
    category: '', // Initialize email
    cost: '',
    address: '',
    status: 'active', // Initialize status as active
    duration:'',
    image:'',
    by:session?.data?.user?.email,
  });
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState<boolean>(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [showSearch, setShowSearch] = useState<boolean>(false); // State for search box
  const [pageSize, setPageSize] = useState<number>(10); // State for page size

  useEffect(() => {
    const fetchUsers = async () => {
      // const usersCollection = collection(db, 'strexService'); 
      // const usersCollection = collection(db, "strexService");

      console.log('session?.data?.user?.email',session?.data?.user?.email)
      if(session?.data?.user?.email){
      const usersCollection = query(collection(db, "strexService"), where("by", "==", session?.data?.user?.email));
      const userDocs: QuerySnapshot<DocumentData> = await getDocs(usersCollection); //@ts-ignore
      const usersData: User[] = userDocs.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name,

        description: doc.data().description,
        category: doc.data().category, // Fetch email
        cost: doc.data().cost,
        by: doc.data().by,
        duration: doc.data().duration,
        address: doc.data().address,
        status: doc.data().status || 'active', // Fetch status or default to active
      }));
      setUsers(usersData);
    }
    };

    const fetchRoles = async () => {
      const rolesCollection = collection(db, 'strexRoles');
      const roleDocs: QuerySnapshot<DocumentData> = await getDocs(rolesCollection);
      const rolesData: Role[] = roleDocs.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name,
      }));
      setRoles(rolesData);
    };

    fetchUsers();
    fetchRoles();
  }, [session?.data?.user?.email]);

  const toggleModal = () => {
    setIsModalOpen(prev => !prev);
    if (isModalOpen) {
      resetForm();
    }
  };

  const resetForm = () => {
    setNewUserData({

        name:  '',
        description:  '',
        category: '', // Fetch email
        cost:  '',
        address:  '',
        status: 'active',
        duration:'',
        image:'',
        by:session?.data?.user?.email,
    });
    setIsEditing(false);
    setSelectedUserId(null);
  };

  const handleAddUser = async () => {
    if (newUserData.name) {
      const userData: User = {
        id: '',
        ...newUserData,
      };
      const docRef = await addDoc(collection(db, 'strexService'), userData);
      setUsers([...users, { ...userData, id: docRef.id }]);
      toast.success('Service added successfully!');
      toggleModal();
    }
  };

  const handleEditUser = async () => {
    if (selectedUserId) {
      await updateDoc(doc(db, 'strexService', selectedUserId), newUserData);
      setUsers(users.map(user => (user.id === selectedUserId ? { ...user, ...newUserData } : user)));
      toast.success('Service updated successfully!');
      toggleModal();
    }
  };

  const openDeleteConfirm = (userId: string) => {
    setUserToDelete(userId);
    setIsDeleteConfirmOpen(true);
  };

  const handleDeleteUser = async () => {
    if (userToDelete) {
      await deleteDoc(doc(db, 'strexService', userToDelete));
      setUsers(users.filter(user => user.id !== userToDelete));
      toast.success('Service deleted successfully!');
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


  const toggleUserStatus = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    await updateDoc(doc(db, 'strexService', userId), { status: newStatus });
    setUsers(users.map(user => (user.id === userId ? { ...user, status: newStatus } : user)));
    toast.success('Service status updated successfully!');
  };
  
  // Prepare data for the react-table
  const data = React.useMemo(() => users.map(user => ({
    ...user, //@ts-ignore
    roleName: roles.find(role => role.id === user.roleId)?.name || 'Unknown',
  })), [users, roles]);

  const columns = React.useMemo(
    () => [
      { Header: 'Service Name', accessor: 'name' },
    { Header: 'category', accessor: 'category' },
    { Header: 'Duration (minute)', accessor: 'duration' },
    { Header: 'Cost', accessor: 'cost' },
    { Header: 'Description', accessor: 'description' },

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

            {/* <button
            className={`text-sm px-2 py-1 rounded-full ${row.original.status === 'active' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}
            onClick={() => toggleUserStatus(row.original.id, row.original.status)}
          >
            {row.original.status === 'active' ? 'Deactivate' : 'Activate'}
          </button> */}
          
          </div>
        ),
      },
    ],
    [users, roles]
  );

  // useTable, useSortBy, usePagination, and useGlobalFilter hooks
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
            Add Service
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
          Add Service
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
            {page.map((row: Row<{
                roleName: string; id: string; name: string; email: string; // Added email field
                // Added email field
                roleId: string; phone: string; address: string; password: string; // Added password field
                // Added password field
                status: string; // Added status field
              }>) => { //@ts-ignore
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

      {/* Bottom Toolbar */}
      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-gray-700">
          Showing {pageIndex * pageSize + 1} to {Math.min((pageIndex + 1) * pageSize, rows.length)} of {rows.length} entries
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            Previous
          </button>

          <span>
            Page{' '}
            <strong>
              {pageIndex + 1} of {pageOptions.length}
            </strong>
          </span>

          <button
            onClick={() => nextPage()}
            disabled={!canNextPage}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            Next
          </button>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-1/3">
            <h3 className="text-lg font-semibold mb-4">{isEditing ? 'Edit Service' : 'Add Service'}</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Service Name</label>
              <input
                type="text"
                name="name"
                value={newUserData.name}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                placeholder="Enter Service Name"
              />
            </div>
            <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Category</label>
              <select
                name="category"
                value={newUserData.category}
                onChange={handleInputChange}
                
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              >
                <option value="">Select Category</option>
                <option value="plumber">Plumber</option>
              </select> 
            </div>
     

           

            {/* <div className="mb-4 d-none">
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <select
                name="roleId"
                value={'LDO0IAcLCscqhNv7cYlv'}
                onChange={handleInputChange}
                
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              >
                <option value="">Select Role</option>
                {roles.map(role => (
                  <option key={role.id} value={role.id}  >
                    {role.name}
                  </option>
                ))}
              </select> 
            </div> */}
             <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Cost</label>
              <input
                type="text"
                name="cost"
                value={newUserData.cost}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                placeholder="Enter Cost"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Duration (minute)</label>
              <input
                type="text"
                name="duration"
                value={newUserData.duration}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                placeholder="Enter Duration"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <input
                type="text"
                name="description"
                value={newUserData.description}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                placeholder="Enter Description"
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
                {isEditing ? 'Update Service' : 'Add Service'}
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
            <p>Are you sure you want to delete this Service?</p>
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
  