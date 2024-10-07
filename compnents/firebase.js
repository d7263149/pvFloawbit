// Import the functions you need from the SDKs you need
import { initializeApp,firebase } from "firebase/app";
import { getFirestore,collection,addDoc,getDocs } from "firebase/firestore";
// import * as firebase from 'firebase';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASEapiKey,
  authDomain: "bv2a-37d51.firebaseapp.com",
  databaseURL: "https://bv2a-37d51-default-rtdb.firebaseio.com",
  projectId: "bv2a-37d51",
  storageBucket: "bv2a-37d51.appspot.com",
  messagingSenderId: "852061388684",
  appId: "1:852061388684:web:cde8fd2bccdc396032a0a9"
};

const app = initializeApp(firebaseConfig);
// const app = initializeApp({...firebaseConfig, projectId: "bv2a-37d51"});

//@ts-ignore
// firebase.firestore().settings({ experimentalForceLongPolling: true }); //add this..
// export const db = firebase.firestore();

export const db = getFirestore();