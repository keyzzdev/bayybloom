import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDAS19xBoV1vAlXJ_kpLHIRfHRLglikZvI",
  authDomain: "bayproject-a8edc.firebaseapp.com",
  projectId: "bayproject-a8edc",
  storageBucket: "bayproject-a8edc.firebasestorage.app",
  messagingSenderId: "110985687586",
  appId: "1:110985687586:web:703cd0858f81187ba5d07b"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);