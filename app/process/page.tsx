// Register.tsx

'use client';

import { useSession } from "next-auth/react";
import { Button, Card, Modal } from "flowbite-react";
import { useState, useEffect } from "react";
import { db } from '../../compnents/firebase'; // Ensure this is the correct path to your firebase.js
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

interface FormData {
  company: string;
  contact: string;
  phone: string;
  companyEmail: string;
  description: string;
}

export default function Register() {
  const { data: session } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({} as FormData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const storedData = sessionStorage.getItem('registerData');
    if (storedData) {
      setFormData(JSON.parse(storedData));
      sessionStorage.removeItem('registerData'); // Clear stored data after retrieval
    } else if (!session?.user) {
      router.push('/'); // Redirect to login if user is not logged in
    }
  }, [session, router]);

  const checkIfUserExists = async (email: string) => {
    const q = query(collection(db, 'strexUsers'), where('email', '==', email));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty; // If there's at least one document, user exists
  };

  const saveUserData = async (email: string) => {
    const userExists = await checkIfUserExists(email);

    if (userExists) {
      setIsModalOpen(true);
    } else {
      try {
        await addDoc(collection(db, 'strexUsers'), {
          email,
          ...formData,
          createdAt: new Date()
        });
        console.log("User data added successfully!");
        router.push('/success'); // Redirect to a success page after data is saved
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    }
  };

  const handleRegister = async () => {
    setIsLoading(true);
    if (!session?.user) {
      alert('Please log in first.');
      setIsLoading(false);
      return;
    }

    const userEmail = session.user.email as string;
    await saveUserData(userEmail);
    setIsLoading(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    router.push('/'); // Redirect to the login page
  };


  const handleBackButtonClick = () => {
    router.back(); // Go back to the previous page
  };
  return (
    <main className="main">
      <div className="mt-[80px]">
        <h2 className="text-center font-semibold mb-4 mt-8" style={{ fontSize: '22px' }}>
          Supplier Registration
        </h2>

        <Card className="max-w-sm center-card1 mt-[20px]">
          <div className="flex flex-col gap-4">
            <div>
              <strong>Company Name:</strong> {formData.company}
            </div>
            <div>
              <strong>Contact:</strong> {formData.contact}
            </div>
            <div>
              <strong>Phone:</strong> {formData.phone}
            </div>
            <div>
              <strong>Company Email:</strong> {formData.companyEmail}
            </div>
            <div>
              <strong>Description:</strong> {formData.description}
            </div>
            <Button onClick={handleRegister} color="blue" disabled={isLoading}>
              {isLoading ? "Processing..." : "Register"}
            </Button>
            <Button 
              onClick={handleBackButtonClick} 
              className="mt-2" 
              color="gray" 
              style={{ backgroundColor: '#F3F4F6', color: '#111827' }}>
              Back
            </Button>
          </div>
        </Card>
      </div>

      {/* Modal for "Email already exists" */}
      <Modal show={isModalOpen} onClose={closeModal}>
        <Modal.Header>
          Email Already Exists
        </Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <p>
              The email you provided is already registered. You will be redirected to the login page.
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={closeModal}>
            Okay
          </Button>
        </Modal.Footer>
      </Modal>
    </main>
  );
}
