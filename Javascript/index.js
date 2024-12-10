import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-app.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, updatePassword, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-auth.js";


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
  const form = document.getElementById('login-form');
  const passwordField = document.getElementById('password');
  const updatePasswordBtn = document.getElementById('update-password-btn');
  const newPasswordField = document.getElementById('new-password');
  const confirmPasswordField = document.getElementById('confirm-password');
  const togglePassword = document.getElementById('togglePassword');
  const forgotPasswordBtn = document.getElementById('forgot-password-btn');
  const emailField = document.getElementById('email');


  // Clear input fields on load
  emailField.value = '';
  passwordField.value = '';


  // Handle login form submission
  form.addEventListener('submit', async function(event) {
    event.preventDefault();
    const email = emailField.value;
    const password = passwordField.value;


    if (!email || !password) {
      console.log("Email or Password is empty");
      return;
    }


    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;


      if (user.emailVerified) {
        const userRef = doc(db, "admin", user.uid);
        const userDoc = await getDoc(userRef);


        if (userDoc.exists()) {
          const firstLogin = userDoc.data().firstLogin;


          if (firstLogin) {
            // Trigger the password update modal
            const passwordUpdateModal = document.getElementById('password_dialog');
            passwordUpdateModal.style.display = 'block'; // Show the modal
          } else {
            emailField.value = '';
            passwordField.value = '';
            window.location = "dash.html";
          }
         
        } else {
          console.error("User document not found in Firestore.");
        }
      } else {
        alert("Email not verified. Please check your email.");
      }
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        alert("No user found with this email.");
      } else if (error.code === 'auth/wrong-password') {
        alert("Incorrect password. Please try again.");
      }
    }
  });


 


  // Handle password reset via email
  forgotPasswordBtn.addEventListener('click', async function() {
    const email = emailField.value;


    if (!email) {
      alert("Please enter your email address.");
      return;
    }


    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset email sent. Please check your inbox.");
    } catch (error) {
      console.error("Error sending password reset email:", error);
      alert("Error sending password reset email. Please try again.");
    }
  });


  // Handle password update
  updatePasswordBtn.addEventListener('click', async function() {
    const newPassword = newPasswordField.value;
    const confirmPassword = confirmPasswordField.value;


    if (!newPassword) {
      alert("New password cannot be empty.");
      return;
    }


    if (newPassword === confirmPassword) {
      try {
        await updatePassword(auth.currentUser, newPassword);
        const userRef = doc(db, "admin",  auth.currentUser.uid);
        await updateDoc(userRef, { firstLogin: false });


        alert("Password updated successfully. You will now be redirected to the dashboard.");
        window.location = "dash.html";
      } catch (error) {
        console.error("Error updating password:", error);
        alert("Error updating password. Please try again.");
      }
    } else {
      alert("Passwords do not match.");
    }
  });


  // Toggle password visibility
  togglePassword.addEventListener('click', function () {
    const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordField.setAttribute('type', type);
    this.classList.toggle('fa-eye-slash');
  });
});



