// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // 👈 IMPORTANTE


// Tu configuración (ya la tienes bien)
const firebaseConfig = {
  apiKey: "AIzaSyAQ9npAuA2iOR6B7ENpUS4fSysV_s_j9Xg",
  authDomain: "appfirebase-53d44.firebaseapp.com",
  projectId: "appfirebase-53d44",
  storageBucket: "appfirebase-53d44.firebasestorage.app",
  messagingSenderId: "784582989083",
  appId: "1:784582989083:web:e484a40679a72cd0b2efbe"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar la autenticación para usarla en las pantallas
export const auth = getAuth(app);
export const db = getFirestore(app); // 👈 AGREGA ESTO

