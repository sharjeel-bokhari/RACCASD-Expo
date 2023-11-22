import { initializeApp, getReactNativePersistence } from "firebase/app";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, addDoc, doc, setDoc, getDocs,getDoc} from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAZmkhB_kbPqkxe6nZCgV1hYNij7FyJZgc",
    authDomain: "raccasd-f554c.firebaseapp.com",
    projectId: "raccasd-f554c",
    storageBucket: "raccasd-f554c.appspot.com",
    messagingSenderId: "566656558904",
    appId: "1:566656558904:web:ef48f51e1d3aa1826543cd",
    measurementId: "G-Y1RQ784YQ3"
  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  // Use the below code to keep a user logged in 
    // the video: https://www.youtube.com/watch?v=GXlBvRmwwRQ find similar videos for this
    // const auth = initializeAuth(app, {
    //     persistence: getReactNativePersistence(ReactNativeAsyncStorage)
    //   });

export { app, db, getAuth, getFirestore, createUserWithEmailAndPassword, signInWithEmailAndPassword, collection, addDoc, doc, setDoc, getDoc, getDocs};