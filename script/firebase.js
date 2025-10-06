// Import the functions you need from the SDKs you need
import 'dotenv/config';


console.log('Olá!', variavelTeste);

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAzNJz6Cum2aY-x3l_TNEmbkygipaPTfnw",
  authDomain: "taxireceiptemail.firebaseapp.com",
  projectId: "taxireceiptemail",
  storageBucket: "taxireceiptemail.firebasestorage.app",
  messagingSenderId: "371002152903",
  appId: "1:371002152903:web:be3ba4d62bbc10a95b2be2",
  measurementId: "G-T6QYLYDTFD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);