import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-auth.js";

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
const auth = getAuth(app);

let btnBck = document.getElementById("btnBck");
btnBck.addEventListener('click', () => {
    window.location = 'index.html'
})

var form = document.getElementById('register-form');

form.addEventListener('submit', async function(event) {
  event.preventDefault();
  
  var email = document.getElementById('reg-email').value;
  var password = document.getElementById('reg-password').value;
  var name = document.getElementById('name').value;

  var confirm = document.getElementById('confirm').value;

  if (password !== confirm) {
    console.log("Passwords do not match");
    return;
  }

  try {
    // Create user with email and password
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Add user data to Firestore
    await addDoc(collection(db, "users","admin","admin_account"), {
   
      email: email,
      name: name,
      password: confirm,
      status: "Active"

      
    });

    console.log("User registered and data stored in Firestore");
    window.location = 'index.html';
  } catch (error) {
    console.error("Error registering user:", error);
  }
});
