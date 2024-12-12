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


document.addEventListener('DOMContentLoaded', function () {
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

  // Flag to track if the modal has been closed
  let modalClosed = false;

  // Function to display the error modal
  function showErrorModal(message) {
    if (modalClosed) return; // Don't show the modal if it was already closed
    const errorMessage = document.getElementById('errorMessage');
    const errorModal = document.getElementById('errorModal');
    errorMessage.textContent = message;
    errorModal.style.display = 'block'; // Show the modal
  }

  // Function to close the error modal
  function closeErrorModal() {
    const errorModal = document.getElementById('errorModal');
    errorModal.style.display = 'none'; // Hide the modal
    modalClosed = true; // Set the flag to true when the modal is closed
  }

  // Ensure the "Close" button works
  const closeButton = document.getElementById('closeBtn');
  closeButton.addEventListener('click', closeErrorModal);

  // Handle login form submission
  form.addEventListener('submit', async function (event) {
    event.preventDefault();

    // Reset the modalClosed flag each time the form is submitted
    if (modalClosed) {
      modalClosed = false; // Reset flag so modal can show again on new error
    }

    const email = emailField.value;
    const password = passwordField.value;

    // Validate if email or password are empty
    if (!email || !password) {
      showErrorModal("Email or Password cannot be empty.");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Check if the email is verified
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
          showErrorModal("User document not found in Firestore.");
        }
      } else {
        showErrorModal("Email not verified. Please check your email.");
      }
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        showErrorModal("No user found with this email.");
      } else if (error.code === 'auth/wrong-password') {
        showErrorModal("Incorrect password. Please try again.");
      } else {
        showErrorModal("An error occurred. Please try again later.");
      }
    }
  });

  // Handle password reset via email
  forgotPasswordBtn.addEventListener('click', async function () {
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

  updatePasswordBtn.addEventListener('click', async function () {
    const newPassword = newPasswordField.value.trim();
    const confirmPassword = confirmPasswordField.value.trim();

    const user = auth.currentUser;

    try {
        const userRef = doc(db, "admin", user.uid);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
            showErrorModal("Error: User document not found.");
            return;
        }

        const currentPassword = userDoc.data()?.password || "";
        console.log("Retrieved Current Password:", currentPassword);  // Log current password

        // Split current password into lastName and employeeNumber (to form the default password)
        const [lastName, employeeNumber] = currentPassword.split('_');
        console.log("Last Name:", lastName);  // Log last name
        console.log("Employee Number:", employeeNumber);  // Log employee number

      

        // Construct the default password (should be lastname_employeeNumber)
        const defaultPassword = `${lastName}_${employeeNumber}`;
        console.log("Constructed Default Password:", defaultPassword);  // Log constructed default password

        // Ensure newPassword is not the same as defaultPassword
        if (newPassword === defaultPassword) {
            showErrorModal("New password cannot be the same as the default password.");
            return;
        }

        // Check if newPassword is empty
        if (!newPassword) {
            showErrorModal("New password cannot be empty.");
            return;
        }

        // Ensure the newPassword and confirmPassword match
        if (newPassword !== confirmPassword) {
            showErrorModal("Passwords do not match.");
            return;
        }

        // Update password and Firestore
        try {
            await updatePassword(user, newPassword);
            console.log("Password successfully updated.");

            await updateDoc(userRef, { firstLogin: false });
            console.log("Firestore updated.");

            showSuccessModal("Password updated successfully. Redirecting to dashboard...");
            setTimeout(() => {
                window.location = "dash.html";
            }, 2000);
        } catch (error) {
            console.error("Error updating password:", error);
            showErrorModal("Failed to update the password. Please try again.");
        }
    } catch (error) {
        console.error("Error:", error);
        showErrorModal("An error occurred. Please try again.");
    }

    console.log("Current Password:", currentPassword);
    console.log("New Password:", newPassword);
});

  
  
  
  // Close modal event handlers
  document.getElementById('closeBtn').addEventListener('click', () => {
    document.getElementById('errorModal').style.display = 'none';
  });
  
  document.getElementById('closeBtn1').addEventListener('click', () => {
    document.getElementById('errorModal1').style.display = 'none';
  });
  
  

  // Function to show the error modal
  function showErrorModal(message) {
    const errorMessage1 = document.getElementById('errorMessage1');
    const errorModal1 = document.getElementById('errorModal1');
    errorMessage1.textContent = message;
    errorModal1.style.display = 'block'; // Show the modal
  }

  // Function to close the error modal
  const closeButton1 = document.getElementById('closeBtn');
  closeButton1.addEventListener('click', function () {
    const errorModal = document.getElementById('errorModal');
    errorModal.style.display = 'none'; // Hide the modal
  });

  // Optional: Create a success modal function if you need a separate one for success messages
  function showSuccessModal(message) {
    const errorMessage1 = document.getElementById('errorMessage1');
    const errorModal1 = document.getElementById('errorModal1');
    errorMessage1.textContent = message;
    errorModal1.style.display = 'block'; // Show the modal
  }

  // Toggle password visibility
  togglePassword.addEventListener('click', function () {
    const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordField.setAttribute('type', type);
    this.classList.toggle('fa-eye-slash');
  });
});

