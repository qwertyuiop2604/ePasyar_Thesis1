import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-auth.js";

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
  // Ensure input fields are empty upon loading
  document.getElementById('email').value = '';
  document.getElementById('password').value = '';

  const form = document.getElementById('login-form');
  const togglePassword = document.getElementById('togglePassword');
  const passwordField = document.getElementById('password');

  form.addEventListener('submit', async function(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (email === '') {
      console.log("Email is empty");
      return;
    } else if (password === '') {
      console.log("Password is empty");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (user.emailVerified) {
        // Clear inputs upon successful login
        document.getElementById('email').value = '';
        document.getElementById('password').value = '';
        window.location = "dash.html";
      } else {
        console.log("Email not verified. Please check your email for verification.");
        alert("Email not verified. Please check your email for verification.");
      }
    } catch (error) {
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        console.error("Invalid email or password.");
        alert("Invalid email or password.");
      } else {
        console.error("Error signing in:", error);
      }
    }
  });

  // Toggle password visibility
  togglePassword.addEventListener('click', function () {
    const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordField.setAttribute('type', type);
    this.classList.toggle('fa-eye-slash');
  });
});
