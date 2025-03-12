// Import Firebase SDK functions 
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDK0lVN_WOSwh91agIzOb1G75zL2Z_K5JM",
    authDomain: "raj-mahal-orders.firebaseapp.com",
    projectId: "raj-mahal-orders",
    storageBucket: "raj-mahal-orders.appspot.com",
    messagingSenderId: "895735329222",
    appId: "1:895735329222:web:5b2c07e4ea28d0592382c7",
    measurementId: "G-FP6632H2FW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app); // Initialize Firestore

export { db, app, analytics };