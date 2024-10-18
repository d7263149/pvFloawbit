import { useState } from 'react';
import Link from 'next/link';
import { FaBars, FaTimes } from 'react-icons/fa';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <img src="/images/black.png" alt="Logo" className="h-10 w-auto" />
          <h1 className="ml-2 text-xl font-bold text-orange-600"></h1>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6">
          <Link href="/" className="text-gray-700 hover:text-orange-600">
            Home
          </Link>
          <Link href="#" className="text-gray-700 hover:text-orange-600">
            Service List
          </Link>
          <Link href="#" className="text-gray-700 hover:text-orange-600">
            Subscription Plan
          </Link>
          <Link href="#" className="text-gray-700 hover:text-orange-600">
            Contact
          </Link>
        </nav>

        {/* Mobile Navigation - Hamburger Icon */}
        <button
          onClick={toggleMenu}
          className="md:hidden text-gray-700 hover:text-orange-600 focus:outline-none"
        >
          {isOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu (Shows only when isOpen is true) */}
      {isOpen && (
        <nav className="bg-white shadow-md md:hidden">
          <div className="flex flex-col space-y-4 py-4 px-6">
            <Link href="/" className="text-gray-700 hover:text-orange-600 text-lg" onClick={toggleMenu}>
              Home
            </Link>
            <Link href="/service-list" className="text-gray-700 hover:text-orange-600 text-lg" onClick={toggleMenu}>
              Service List
            </Link>
            <Link href="/subscription-plan" className="text-gray-700 hover:text-orange-600 text-lg" onClick={toggleMenu}>
              Subscription Plan
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-orange-600 text-lg" onClick={toggleMenu}>
              Contact
            </Link>
            <Link href="/login" className="bg-orange-600 text-white py-2 px-4 rounded hover:bg-orange-700" onClick={toggleMenu}>
              Account
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;
