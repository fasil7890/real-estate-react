// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCxd7IsG540GpVHPqxgCd-gXt_JPLBHHvo",
  authDomain: "realtor-clone-45336.firebaseapp.com",
  projectId: "realtor-clone-45336",
  storageBucket: "realtor-clone-45336.appspot.com",
  messagingSenderId: "866375809042",
  appId: "1:866375809042:web:de091a7dd963b4e0c980cb"
};

// Initialize Firebase
initializeApp(firebaseConfig);

export const db = getFirestore();