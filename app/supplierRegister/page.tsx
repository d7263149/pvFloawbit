'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { TextInput, Button, Card, Label, Modal, Textarea } from "flowbite-react";
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';
import { getFirestore, collection, addDoc, query, where, getDocs } from 'firebase/firestore'; 
import { db } from '../../compnents/firebase'; // import your Firebase config

// const db = getFirestore(app);

// Define types for form data
interface FormData {
  company: string;
  email: string;
  contact: string;
  phone: string;
  roleId: string;
  status: string;
}

export default function Register() {
  const router = useRouter();

  // State for modal and form data
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showErrorModal, setShowErrorModal] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    company: '',
    email: '',
    contact: '',
    phone: '',
    roleId: 'supplier', // Assuming a default role for suppliers
    status: 'LDO0IAcLCscqhNv7cYlv'
  });

  // Function to check if companyEmail exists in Firebase
  const checkIfEmailExists = async (email: string): Promise<boolean> => {
    const q = query(collection(db, 'strexUsers'), where('companyEmail', '==', email));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  };

  // Form submit handler
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const emailExists = await checkIfEmailExists(formData.email);

      if (emailExists) {
        setShowErrorModal(true); // Show error modal if email already exists
        return;
      }

      await addDoc(collection(db, 'strexUsers'), formData); // Save to Firebase
      setShowModal(true); // Show success modal
    } catch (error) {
      toast.error("Registration failed. Please try again."); // Error handling
    }
  };

  // Input change handler
  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <main className="main">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <div className="mt-[80px]">
        <div className="company-logo text-center">
          <a href={process.env.NEXT_PUBLIC_URL} className="logo img-responsive">
            <img src="/images/black.png" style={{ height: '62px' }} className="img-responsive" alt=" CRM" />
          </a>
        </div>

        <h2 style={{ fontSize: '22px' }} className="text-center text-neutral-800 font-semibold mb-5 mt-8">
          Supplier Registration
        </h2>

        <Card className="max-w-sm center-card1 mt-[20px]">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="companyName" value="Company Name" />
              <TextInput
                id="company"
                name="companyName"
                type="text"
                placeholder="Enter company name"
                required
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="companyEmail" value="Company Email" />
              <TextInput
                id="companyEmail"
                name="email"
                type="email"
                placeholder="name@company.com"
                required
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="contact" value="Contact Person" />
              <TextInput
                id="contact"
                name="contact"
                type="text"
                placeholder="Enter contact person"
                required
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="phone" value="Phone" />
              <TextInput
                id="phone"
                name="phone"
                type="tel"
                placeholder="Enter phone number"
                required
                onChange={handleChange}
              />
            </div>
            <div>
                <Label htmlFor="description" value="Description" />
                {//@ts-ignore
                }
                <Textarea id="description" name='description' placeholder="Description"  onChange={handleChange} />
              </div>
              
            <Button type="submit" color="blue">Register</Button>
          </form>
        </Card>

        {/* Success Modal */}
        <Modal show={showModal} onClose={() => setShowModal(false)}>
          <Modal.Header>Registration Pending</Modal.Header>
          <Modal.Body>
            <p>Your registration is pending approval. We will update you shortly.</p>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => router.push('/')}>OK</Button>
          </Modal.Footer>
        </Modal>

        {/* Error Modal for existing email */}
        <Modal show={showErrorModal} onClose={() => setShowErrorModal(false)}>
          <Modal.Header>Email Already Exists</Modal.Header>
          <Modal.Body>
            <p>The email you have entered is already registered. Please try with a different email.</p>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => setShowErrorModal(false)}>OK</Button>
          </Modal.Footer>
        </Modal>
      </div>
    </main>
  );
}
