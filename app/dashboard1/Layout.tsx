"use client"
import Link from "next/link";
import { useState } from "react";

// components/Layout.js
const Layout = ({ children:any }) => {
    const [isOpen, setIsOpen] = useState(true);
  
    return (
      <div className="flex min-h-screen bg-gray-100">
        {/* Sidebar */}
        <div className={`bg-gray-800 p-4 ${isOpen ? 'w-64' : 'w-20'} transition-width duration-300`}>
          <div className="text-white mb-4">
            <button onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? 'Close' : 'Open'}
            </button>
          </div>
          <nav className="space-y-2">
            <Link href="/dashboard">
              <a className="block text-gray-300 hover:bg-gray-700 p-2 rounded">Dashboard</a>
            </Link>
            <Link href="/users">
              <a className="block text-gray-300 hover:bg-gray-700 p-2 rounded">Users</a>
            </Link>
            <Link href="/settings">
              <a className="block text-gray-300 hover:bg-gray-700 p-2 rounded">Settings</a>
            </Link>
          </nav>
        </div>
  
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Top bar */}
          <header className="bg-white shadow p-4">
            <div className="flex justify-between">
              <h1 className="text-xl font-semibold">Admin Panel</h1>
              <button className="bg-blue-500 text-white px-4 py-2 rounded">Logout</button>
            </div>
          </header>
  
          {/* Page content */}
          <main className="p-6 flex-1">
            {children}
          </main>
        </div>
      </div>
    );
  };
  
  export default Layout;
  