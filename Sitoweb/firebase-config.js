import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js';
import { getDatabase } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js';
import { getStorage } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-storage.js';
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-analytics.js';


const firebaseConfig = {
  apiKey: "AIzaSyBGs9D4kM9SSGJ4xT9Advx4BYeKaamp3go",
  authDomain: "lgxedu-1e822.firebaseapp.com",
  projectId: "lgxedu-1e822",
  storageBucket: "lgxedu-1e822.appspot.com",
  messagingSenderId: "1017991754482",
  appId: "1:1017991754482:web:81ed59950e0fd92596566b",
  measurementId: "G-W7FSZTN2SG"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const firestore = getFirestore(app);
const storage = getStorage(app);
const analytics = getAnalytics(app);

export { db, firestore, storage, analytics };
