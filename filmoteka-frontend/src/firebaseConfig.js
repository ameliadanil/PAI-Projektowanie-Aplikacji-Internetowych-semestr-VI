// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCDESBJ4RMdWA1RveiPPjPr_OJXxv4B97U",
  authDomain: "filmoteka-f0f9e.firebaseapp.com",
  projectId: "filmoteka-f0f9e",
  storageBucket: "filmoteka-f0f9e.firebasestorage.app",
  messagingSenderId: "734589156373",
  appId: "1:734589156373:web:063149dcf264b6931fa21c",
  measurementId: "G-607GQXSLL1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);