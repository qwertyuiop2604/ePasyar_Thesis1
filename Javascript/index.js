import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-app.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, updatePassword } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-auth.js";

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
  const passwordDialog = document.getElementById('password_dialog');
  const updatePasswordBtn = document.getElementById('update-password-btn');
  const newPasswordField = document.getElementById('new-password');
  const confirmPasswordField = document.getElementById('confirm-password');
  const togglePassword = document.getElementById('togglePassword');
  const passwordField = document.getElementById('password');
  const forgotPasswordLink = document.getElementById('forgotPass');
  const closeModal = document.querySelector(".modal .close");

  // Clear input fields on load
  document.getElementById('email').value = '';
  passwordField.value = '';

  // Handle "Forgot Password" link to open the modal
  forgotPasswordLink.addEventListener("click", function() {
    passwordDialog.style.display = "block";
  });

  // Close the modal when the "X" is clicked
  closeModal.addEventListener("click", function() {
    passwordDialog.style.display = "none";
  });

  // Close the modal if clicking outside of the modal content
  window.addEventListener("click", function(event) {
    if (event.target === passwordDialog) {
      passwordDialog.style.display = "none";
    }
  });

  // Handle login form submission
  form.addEventListener('submit', async function(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = passwordField.value;

    if (!email || !password) {
      console.log("Email or Password is empty");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (user.emailVerified) {
        const userRef = doc(db, "users", "admin", "admin_account", user.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const firstLogin = userDoc.data().firstLogin;

          if (firstLogin) {
            passwordDialog.style.display = 'block';
          } else {
            document.getElementById('email').value = '';
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
        const userRef = doc(db, "users", "admin", "admin_account", auth.currentUser.uid);
        await updateDoc(userRef, { firstLogin: false });

        alert("Password updated successfully. You will now be redirected to the dashboard.");
        passwordDialog.style.display = 'none';
        window.location = "dash.html";
      } catch (error) {
        console.error("Error updating password:", error);
        alert("Error updating password. Please try again.");
      }
    } else {
      alert("Passwords do not match.");
    }
  });

  // Close the password dialog
  document.querySelector('.close').onclick = function() {
    passwordDialog.style.display = 'none';
  };

  // Toggle password visibility
  togglePassword.addEventListener('click', function () {
    const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordField.setAttribute('type', type);
    this.classList.toggle('fa-eye-slash');
  });
});


