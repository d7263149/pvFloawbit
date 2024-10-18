// Login.tsx

'use client';

import { signIn, useSession } from "next-auth/react";
import { Button, Card, Label, TextInput, Textarea } from "flowbite-react";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from '../../compnents/firebase'; // Ensure this is the correct path to your firebase.js

interface FormData {
  company: string;
  contact: string;
  phone: string;
  companyEmail: string;
  description: string;
}

export default function Login() {

    
  const { data: session } = useSession();
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    company: '',
    contact: '',
    phone: '',
    companyEmail: '',
    description: ''
  });

  const checkIfUserExists = async (email: any) => {
    console.log('email',email)
    const q = query(collection(db, 'strexUsers'), where('email', '==', email));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty; // If there's at least one document, user exists
  };

  const mainurl = process.env.NEXT_PUBLIC_URL;
 useEffect(() => {
    // Check if the user is already signed in
    if (session?.user) {
      // Check if all fields are filled in session storage
      const storedData = sessionStorage.getItem('registerData');
      if (storedData) {
        const data: FormData = JSON.parse(storedData);
        setFormData(data); // Set form data to the stored data
        // Redirect to registration page if all fields are filled
        if (data.company && data.contact && data.phone && data.companyEmail && data.description) {
        //   router.push('/process');
        }
        
      }
    //   async function () => checknesws {
    // //   let c:any =   checkIfUserExists(session?.user?.email);
    //   
    // // let c:any =   checkIfUserExists('ranchirock@gmail.com');
    //   }
    const myAsyncFunction = async () => {
        // Asynchronous code goes here
        const userExists = await checkIfUserExists(session?.user?.email);
        console.log('userExists',userExists)
        if(userExists){
       
            router.push(mainurl + '?msg=already register user');
        }

      };

      myAsyncFunction();



    }

  }, [session, router]);

  const handleGoogleSignIn = async () => {
    // Sign in with Google
    await signIn('google', { callbackUrl: '/process' }).then(async (response) => {
      if (response?.error) {
        console.error('Error signing in with Google:', response.error);
        return;
      }
      
      // Store form data to session storage if Google sign in is successful
      sessionStorage.setItem('registerData', JSON.stringify(formData));
      router.push('/process'); // Redirect to registration page
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [id]: value
    }));
  };

  // Disable button if not all fields are filled
  const isButtonDisabled = !formData.company || !formData.contact || !formData.phone || !formData.companyEmail || !formData.description;

  return (
    <main className="main">
      <div className="mt-[80px]">
        <h2 className="text-center font-semibold mb-4 mt-8" style={{ fontSize: '22px' }}>
          Supplier Registration
        </h2>

        <Card className="max-w-sm center-card1 mt-[20px]">
          <div className="flex flex-col gap-4">
            <form className="flex flex-col gap-2">
              <div>
                <Label htmlFor="company" value="Company Name" />
                <TextInput id="company" type="text" placeholder="Company Name" required value={formData.company} onChange={handleInputChange} />
              </div>

              <div>
                <Label htmlFor="contact" value="Contact" />
                <TextInput id="contact" type="text" placeholder="Contact" required value={formData.contact} onChange={handleInputChange} />
              </div>

              <div>
                <Label htmlFor="phone" value="Phone" />
                <TextInput id="phone" type="text" placeholder="Phone" required value={formData.phone} onChange={handleInputChange} />
              </div>

              <div>
                <Label htmlFor="companyEmail" value="Company Email" />
                <TextInput id="companyEmail" type="text" placeholder="Company Email" required value={formData.companyEmail} onChange={handleInputChange} />
              </div>

              <div>
                <Label htmlFor="description" value="Description" />
                <Textarea id="description" placeholder="Description" required value={formData.description} onChange={handleInputChange} />
              </div>
            </form>
            <Button onClick={handleGoogleSignIn} color="blue" disabled={isButtonDisabled}>
              Verify
            </Button>
          </div>
        </Card>
      </div>
    </main>
  );
}
