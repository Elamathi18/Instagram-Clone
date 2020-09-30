// For Firebase JS SDK v7.20.0 and later, measurementId is opt
import firebase from "firebase";
const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyCvrl5bRwFufYsMltOX7CKxioF-Cp20Bsk",
  authDomain: "instagram-clone-5e1f2.firebaseapp.com",
  databaseURL: "https://instagram-clone-5e1f2.firebaseio.com",
  projectId: "instagram-clone-5e1f2",
  storageBucket: "instagram-clone-5e1f2.appspot.com",
  messagingSenderId: "726994012865",
  appId: "1:726994012865:web:dfdbac9b5562e0d0b32240",
  measurementId: "G-T3882RVVT1"
  });
const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();
    
export { db, auth, storage };
