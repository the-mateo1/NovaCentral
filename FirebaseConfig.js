import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBuZMijGpfNcm_Qe_2OEbhCyHOOdBOBt4E",
  authDomain: "novacentral-fface.firebaseapp.com",
  projectId: "novacentral-fface",
  storageBucket: "novacentral-fface.firebasestorage.app",
  messagingSenderId: "583381013414",
  appId: "1:583381013414:android:3ef2a8c1c400b7403ff567"
};
  
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;