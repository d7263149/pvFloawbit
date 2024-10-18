'use client';
import React, { useState, useEffect } from 'react';
import { FaFilter, FaMapMarkerAlt } from 'react-icons/fa';
import Header from '../../compnents/front/Header'; // Importing header component
import Footer from '../../compnents/front/Footer'; // Importing footer component
import Banner from '../../compnents/front/Banner'; // Importing banner component
import { collection, getDocs, query, where } from 'firebase/firestore'; // Firestore imports
import { db } from "../../compnents/firebase"; // Import Firebase instance

// Define TypeScript interfaces
interface StrexSupplier {
  id: string;
  name: string;
  description: string;
  contact: string;
  seller: string;
}

interface StrexCategory {
  id: string;
  name: string;
}

interface StrexCategorySupplier {
  catId: string;
  userId: string;
}

const SupplierList = () => {
  const [suppliers, setSuppliers] = useState<StrexSupplier[]>([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState<StrexSupplier[]>([]);
  const [categories, setCategories] = useState<StrexCategory[]>([]);
  const [categorySupplier, setCategorySupplier] = useState<StrexCategorySupplier[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all'); // 'all' by default

  // Fetch categories from Firestore
  useEffect(() => {
    const fetchCategories = async () => {
      const categoriesCollection = collection(db, 'strexCategory'); // Collection for categories
      const categorySnapshot = await getDocs(categoriesCollection);
      const categoryList = categorySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as StrexCategory[];

      setCategories(categoryList); // Store categories in state
    };

    fetchCategories();
  }, []);

  // Fetch category-supplier relationships from Firestore
  useEffect(() => {
    const fetchCategorySupplier = async () => {
      const categorySupplierCollection = collection(db, 'strexCategorySupplier');
      const categorySupplierSnapshot = await getDocs(categorySupplierCollection);
      const categorySupplierList = categorySupplierSnapshot.docs.map((doc) => ({
        ...doc.data(),
      })) as StrexCategorySupplier[];

      setCategorySupplier(categorySupplierList); // Store category-supplier relationships
    };

    fetchCategorySupplier();
  }, []);

  // Fetch suppliers based on selected category
  useEffect(() => {
    const fetchSuppliers = async () => {
      const suppliersCollection = collection(db, "strexUsers");
      const supplierSnapshot = await getDocs(suppliersCollection);
      const supplierList = supplierSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as StrexSupplier[];

      if (selectedCategory === 'all') {
        // No category selected, show all suppliers
        setSuppliers(supplierList);
        setFilteredSuppliers(supplierList);
      } else {
        // Filter suppliers based on the selected category
        const filteredUserIds = categorySupplier
          .filter(cs => cs.catId === selectedCategory)
          .map(cs => cs.userId);

        const filtered = supplierList.filter(supplier =>
          filteredUserIds.includes(supplier.id)
        );

        setFilteredSuppliers(filtered);
      }
    };

    fetchSuppliers();
  }, [selectedCategory, categorySupplier]);

  // Handle category change
  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(event.target.value); // Set selected category ID
  };

  // Function to get category names associated with a supplier
  const getCategoriesByUserId = (userId: string): string[] => {
    const associatedCategoryIds = categorySupplier
      .filter(cs => cs.userId === userId)
      .map(cs => cs.catId);

    return associatedCategoryIds.map(catId => {
      const category = categories.find(cat => cat.id === catId);
      return category ? category.name : '';
    }).filter(Boolean); // Filter out empty values
  };

  return (
    <div>
      {/* Header */}
      <Header />

      {/* Banner */}
      <Banner />

      {/* Supplier List Page */}
      <div className="container mx-auto px-4 py-8">
  {/* Flexbox for larger screens */}
  <div className="flex flex-wrap md:flex-nowrap md:space-x-6 space-y-6 md:space-y-0"> 
    {/* Sidebar for filters */}
    <aside className="w-full md:w-1/4 bg-white rounded-lg p-4 shadow-md order-1 md:order-none">
      <h2 className="text-lg font-semibold mb-4">Supplier Filters</h2>

      {/* Category Filter */}
      <label className="block mb-2 text-sm font-medium text-gray-700">Select Category</label>
      <select
        className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
        value={selectedCategory}
        onChange={handleCategoryChange}
      >
        <option value="all">All Categories</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
    </aside>

    {/* Main content */}
    <main className="w-full md:w-3/4 order-3 md:order-none">
      {/* Map section - Hidden on mobile */}
      <div className="h-72 mb-8 bg-gray-100 justify-center items-center rounded-lg shadow-md hidden md:flex">
        <FaMapMarkerAlt className="text-4xl text-gray-500" />
        <p className="text-gray-500 ml-2">Map View - Coming soon</p>
      </div>

      {/* Supplier grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSuppliers.length > 0 ? (
          filteredSuppliers.map((supplier) => (
            <div
              key={supplier.id}
              className="border border-gray-200 p-4 rounded-lg shadow-sm bg-white"
            >
              <h3 className="text-lg font-semibold mb-2">{supplier.contact}</h3>
              <p className="text-gray-600 mb-4">{supplier.description}</p>
              <div className="flex justify-between items-center mb-4">
                <span className="text-blue-500 font-bold text-lg"></span>
                <div className="flex flex-wrap gap-1">
                  {getCategoriesByUserId(supplier.id).map((categoryName) => (
                    <span
                      key={categoryName}
                      className="bg-blue-100 text-blue-600 text-xs font-semibold px-2 py-1 rounded-lg"
                    >
                      {categoryName}
                    </span>
                  ))}
                </div>
              </div>
              <button className="w-full py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
                Book Now
              </button>
            </div>
          ))
        ) : ( 
          <p className="text-gray-500 col-span-full text-center">No suppliers available.</p>
        )}
      </div>
    </main>
  </div>
</div>


      {/* Footer */}
      <Footer />
    </div>
  );
};

export default SupplierList;
