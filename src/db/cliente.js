// src/db/cliente.js
import { getFirestore } from 'firebase/firestore';
import { app } from '../../firebaseConfig'; // Asegúrate de importar tu app

export const db = getFirestore(app);
