import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDaN8mr07otXHHOTSFWnXEJdzBN0TuJuPk",
  authDomain: "altru-cosina.firebaseapp.com",
  projectId: "altru-cosina",
  storageBucket: "altru-cosina.firebasestorage.app",
  messagingSenderId: "1079440197632",
  appId: "1:1079440197632:web:455616f2fe7ecbc6a4f0e5",
  measurementId: "G-VR90547JJ9"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
