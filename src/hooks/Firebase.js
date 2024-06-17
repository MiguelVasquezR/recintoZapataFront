import { initializeApp } from "firebase/app";
import 'firebase/storage';
// Import the functions you need from the SDKs you need

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBtuyhO-YzFWa2HP8GkQeXY5FYbtr152Gk",
    authDomain: "imagesrecintozapata.firebaseapp.com",
    projectId: "imagesrecintozapata",
    storageBucket: "imagesrecintozapata.appspot.com",
    messagingSenderId: "452717716397",
    appId: "1:452717716397:web:7ee2fd45c83cbae834f724"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;