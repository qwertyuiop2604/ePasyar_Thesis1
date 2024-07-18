import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-auth.js";

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

document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('register-form');
  const togglePasswordIcons = document.querySelectorAll('.toggle-password');

  form.addEventListener('submit', async function(event) {
    event.preventDefault();

    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('password').value;
    const name = document.getElementById('name').value;
    const position = document.getElementById('position').value;
    const confirmPassword = document.getElementById('confirm').value;

    if (email === '') {
      console.log("Email is empty");
      return;
    } else if (password === '') {
      console.log("Password is empty");
      return;
    } else if (name === '') {
      console.log("Name is empty");
      return;
    } else if (position === '') {
      console.log("Position is empty");
      return;
    } else if (password !== confirmPassword) {
      console.log("Passwords do not match");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Send email verification
      await sendEmailVerification(user);

      // Add user details to Firestore
      await addDoc(collection(db, "users", "admin", "admin_account"), {
        email: email,
        name: name,
        position: position,
        status: "Active",
     
      });

      // Clear inputs upon successful registration
      form.reset();
      alert('Registration successful! Please check your email to verify your account.');
      window.location = "index.html";
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        console.error("Error signing in: Email already in use.");
      } else {
        console.error("Error signing in:", error);
      }
    }
  });

  // Toggle password visibility
  togglePasswordIcons.forEach(icon => {
    icon.addEventListener('click', function () {
      const targetId = this.getAttribute('data-toggle');
      const targetField = document.getElementById(targetId);
      if (targetField) {
        const type = targetField.getAttribute('type') === 'password' ? 'text' : 'password';
        targetField.setAttribute('type', type);
        this.classList.toggle('fa-eye-slash');
      }
    });
  });
});

document.getElementById('btnBack').addEventListener('click', function() {
  window.history.back();
});
