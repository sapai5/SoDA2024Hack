import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBgrviost9VRi-w-O73JnhTYCirnJLRFrc",
    authDomain: "studymatch-87f9e.firebaseapp.com",
    projectId: "studymatch-87f9e",
    storageBucket: "studymatch-87f9e.appspot.com",
    messagingSenderId: "651388533678",
    appId: "1:651388533678:web:86a565b2cbddf982b8263f",
    measurementId: "G-7FJJRBR5TW"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

export { db };