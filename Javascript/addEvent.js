import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-app.js";
import { getFirestore, addDoc, doc, collection, getDocs, updateDoc } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyA6U1In2wlItYioP3yl43C3hCgiXUZ4oKI",
    authDomain: "epasyar-aa569.firebaseapp.com",
    databaseURL: "https://epasyar-aa569-default-rtdb.firebaseio.com",
    projectId: "epasyar-aa569",
    storageBucket: "epasyar-aa569.appspot.com",
    messagingSenderId: "1004550371893",
    appId: "1:1004550371893:web:692e667675470640980f7c"
  };
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

document.getElementById('create-form').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const name = document.getElementById('name').value;
    const file = document.getElementById('file-input').files[0];
  
    // Upload file to Firebase Storage
    const storageRef = ref(storage, 'files/' + file.name);
    await uploadBytes(storageRef, file);
  
    // Get the download URL for the file
    const downloadURL = await getDownloadURL(storageRef);
  
    // Add the file download URL to Firestore
    await addDoc(collection(db, 'files'), {
      name,
      downloadURL
    });
  
    alert('File uploaded successfully!');
    document.getElementById('create-form').reset();
  });
  