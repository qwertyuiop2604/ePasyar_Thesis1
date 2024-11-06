import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-app.js";
import {
  getFirestore,
  setDoc,
  doc,
  getDocs,
  updateDoc,
  collection,
} from "https://www.gstatic.com/firebasejs/9.1.1/firebase-firestore.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
} from "https://www.gstatic.com/firebasejs/9.1.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyA6U1In2wlItYioP3yl43C3hCgiXUZ4oKI",
  authDomain: "epasyar-aa569.firebaseapp.com",
  databaseURL: "https://epasyar-aa569-default-rtdb.firebasFeio.com",
  projectId: "epasyar-aa569",
  storageBucket: "epasyar-aa569.appspot.com",
  messagingSenderId: "1004550371893",
  appId: "1:1004550371893:web:692e667675470640980f7c",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Navigation
let dash = document.getElementById("dash");
dash.addEventListener("click", () => (window.location = "dash.html"));
let profile = document.getElementById("profile");
profile.addEventListener("click", () => (window.location = "profile.html"));
let events = document.getElementById("events");
events.addEventListener("click", () => (window.location = "events.html"));
let promotion = document.getElementById("promotion");
promotion.addEventListener("click", () => (window.location = "promotion.html"));
let tourist = document.getElementById("tourist");
tourist.addEventListener("click", () => (window.location = "tourist.html"));
let souvenir = document.getElementById("souvenir");
souvenir.addEventListener("click", () => (window.location = "souvenir.html"));
let restaurant = document.getElementById("restaurant");
restaurant.addEventListener(
  "click",
  () => (window.location = "restaurants.html")
);


let otop = document.getElementById("otop");
otop.addEventListener("click", () => {
  window.location = "otop.html";
});
let localdishes = document.getElementById("localdishes");
localdishes.addEventListener("click", () => {
  window.location = "dishes.html";
});
let localindustries = document.getElementById("localindustries");
localindustries.addEventListener("click", () => {
  window.location = "industries.html";
});

// Create Account Form Popup
const createAcc = document.getElementById("user-create");
const openPop = document.querySelector(".add_acc");
const closePop = document.querySelector(".close-modal");
// For CREATE FORM POPUP
openPop.addEventListener("click", () => {
  createAcc.style.display = "block";
  toggleBlur(true); // Apply blur effect
});

closePop.addEventListener("click", () => {
  createAcc.style.display = "none";
  toggleBlur(false); // Remove blur effect
});

// Register Form - Add to Firebase
const formCreate = document.getElementById("create-form");
const name = document.getElementById("name");
const email = document.getElementById("email");
const position = document.getElementById("position");
const em_no = document.getElementById("em_no");
const btnRegister = document.getElementById("btnRegister"); // Add this line to get the register button

// Register Form - Add to Firebase
btnRegister.addEventListener("click", async (e) => {
  e.preventDefault();
  if (
    name.value === "" ||
    email.value === "" ||
    position.value === "" ||
    em_no.value === ""
  ) {
    alert("All fields are required.");
    return;
  }

  // Create the initial password based on position and employee number
  let password;
  if (position.value.toLowerCase() === "statistician") {
    password = `STAT_${em_no.value.slice(-6)}`;
  } else if (position.value.toLowerCase() === "system administrator") {
    password = `ADMIN_${em_no.value.slice(-6)}`;
  } else {
    alert("Unknown position. Cannot generate password.");
    window.location.reload();
    return;
  }

  try {
    // Create the user with generated password
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email.value,
      password
    );
    const user = userCredential.user;

    // Set initial status to "Pending" and firstLogin to true
    await setDoc(doc(db, "users", "admin", "admin_account", user.uid), {
      name: name.value,
      email: email.value,
      position: position.value,
      status: "Pending",
      firstLogin: true,
    });

    // Send email verification
    await sendEmailVerification(user);
    alert(
      "Account created. Verification email sent. Please verify your email to activate your account."
    );

    createAcc.style.display = "none";
    window.location.reload();
  } catch (error) {
    console.error("Error during registration:", error.message);
    alert(error.message);
  }
});

const user = auth.currentUser;

if (user && user.emailVerified) {
  // Update status to "Active" if email is verified
  await updateDoc(userRef, { status: "Active" })
    .then(() => console.log("User status updated to Active"))
    .catch((error) => console.error("Error updating status: ", error));
}

// Add a listener for authentication state changes
// Listen for auth state changes
auth.onAuthStateChanged(async (user) => {
  if (user) {
    // Check if user is verified each time they log in
    if (user.emailVerified) {
      const userRef = doc(db, "users", "admin", "admin_account", user.uid);
      try {
        await updateDoc(userRef, { status: "Active" });
        console.log("User status updated to Active");
      } catch (error) {
        console.error("Error updating status: ", error);
      }
    } else {
      console.log("User is not verified.");
    
    }
  }
});

// Edit Account Form Popup
const editAcc = document.getElementById("user-edit");
const oPop = document.querySelector(".edit_acc");
const cPop = document.querySelector(".close-modal-edit");

// For EDIT FORM POPUP
oPop.addEventListener("click", () => {
  editAcc.style.display = "block";
  toggleBlur(true); // Apply blur effect
});

cPop.addEventListener("click", () => {
  editAcc.style.display = "none";
  toggleBlur(false); // Remove blur effect
});

// Edit Form - Update to Firebase
const formEdit = document.getElementById("edit-form");
const name1 = document.getElementById("name1");
const email1 = document.getElementById("email1");
const positionEdit = document.getElementById("positionEdit");
const btnSaveEdit = document.getElementById("btnSaveEdit");

btnSaveEdit.addEventListener("click", async (e) => {
  e.preventDefault();
  if (name1.value === "" || email1.value === "" || positionEdit.value === "") {
  } else {
    const userId = localStorage.getItem("ID");
    if (userId) {
      const userRef = doc(db, "users", "admin", "admin_account", userId);
      updateDoc(userRef, {
        name: name1.value,
        email: email1.value,
        position: positionEdit.value,
      })
        .then(() => {
          console.log("Document successfully updated!");
          editAcc.style.display = "none";
        })
        .catch((error) => console.error("Error updating document: ", error));
    } else {
      console.error("No user ID found in localStorage");
      window.location.reload(); // Reload the page to reflect changes
    }
  }
});

// Populating table and setting up row click event
const tbody = document.getElementById("tbody1");

const querySnapshot = await getDocs(
  collection(db, "users", "admin", "admin_account")
);
querySnapshot.forEach((doc) => {
  if (doc.data().status === "Active" || doc.data().status === "Pending") {
    // Code to add row
    const trow = document.createElement("tr");
    const td1 = document.createElement("td");
    const td2 = document.createElement("td");
    const td3 = document.createElement("td");
    const td4 = document.createElement("td");

    td1.textContent = doc.data().name;
    td2.textContent = doc.data().email;
    td3.textContent = doc.data().position;
    td4.textContent = doc.data().status;

    trow.appendChild(td1);
    trow.appendChild(td2);
    trow.appendChild(td3);
    trow.appendChild(td4);

    tbody.appendChild(trow);

    trow.addEventListener("click", () => {
      localStorage.setItem("ID", doc.id);
      console.log(doc.id);

      document
        .querySelectorAll("tr")
        .forEach((row) => row.classList.remove("selected-row"));
      trow.classList.add("selected-row");

      document.getElementById("edit_acc").disabled = false;
      document.getElementById("edit_acc").classList.remove("disabled-button");
      document.getElementById("edit_acc").classList.add("enabled-button");

      document.getElementById("delete_acc").disabled = false;
      document.getElementById("delete_acc").classList.remove("disabled-button");
      document.getElementById("delete_acc").classList.add("enabled-button");

      document.getElementById("name1").value = doc.data().name;
      document.getElementById("email1").value = doc.data().email;
      document.getElementById("position").value = doc.data().position;
    });
  }
});

const currentDateTime = new Date().toLocaleString();

// Event Listener for delete account button
const btnDelete = document.getElementById("delete_acc");
btnDelete.addEventListener("click", async () => {
  const userId = localStorage.getItem("ID");
  if (userId) {
    const userRef = doc(db, "users", "admin", "admin_account", userId);
    await updateDoc(userRef, {
      status: "Deleted",
      deletedBy: "ADMIN",
      deletedDate: currentDateTime,
    })
      .then(() => {
        console.log("Document successfully updated to Deleted!");
        window.location.reload(); // Reload the page to reflect changes
      })
      .catch((error) => console.error("Error updating document: ", error));
  } else {
    console.error("No user ID found in localStorage");
  }
});

// Cancel delete account
const cnl2 = document.getElementById("cancel_delete");
cnl2.addEventListener("click", () => {
  document.getElementById("delete_acc_modal").style.display = "none";
});

//Button to see archived accounts
const archived_acc = document.getElementById("archived_acc");
archived_acc.addEventListener("click", (e) => {
  window.location = "prArchives.html";
});

// Initial disabling of buttons
document.getElementById("edit_acc").disabled = true;
document.getElementById("delete_acc").disabled = true;

// Deselect rows when clicking outside the table
document.addEventListener("click", (event) => {
  const table = document.getElementById("table");
  const isClickInsideTable = table.contains(event.target);
  if (!isClickInsideTable) {
    // Deselect all rows
    document
      .querySelectorAll("tr")
      .forEach((row) => row.classList.remove("selected-row"));

    // Disable buttons
    document.getElementById("edit_acc").disabled = true;
    document.getElementById("edit_acc").classList.remove("enabled-button");
    document.getElementById("edit_acc").classList.add("disabled-button");

    document.getElementById("delete_acc").disabled = true;
    document.getElementById("delete_acc").classList.remove("enabled-button");
    document.getElementById("delete_acc").classList.add("disabled-button");
  }
});
function toggleBlur(shouldBlur) {
  const container = document.querySelector(".main-container"); // Select the common container
  if (shouldBlur) {
    container.classList.add("blur-background");
  } else {
    container.classList.remove("blur-background");
  }
}

//Button to see archived accounts
archived_acc.addEventListener("click", (e) => {
  window.location = "prArchives.html";
});

let logoutModal = document.getElementById("logout");
let modal = document.getElementById("logoutModal");
let closeBtn = document.getElementsByClassName("close")[0];
let confirmBtn = document.getElementById("confirmLogout");
let cancelBtn = document.getElementById("cancelLogout");

logout.addEventListener("click", (event) => {
  event.preventDefault(); // Prevent default link behavior
  modal.style.display = "block"; // Show the modal
});

closeBtn.onclick = function() {
  modal.style.display = "none"; // Hide the modal when the close button is clicked
};

cancelBtn.onclick = function() {
  modal.style.display = "none"; // Hide the modal when cancel button is clicked
};

confirmBtn.onclick = function() {
  window.location = "index.html"; // Redirect to index.html on confirmation
};

// Close the modal when clicking outside of it
window.onclick = function(event) {
  if (event.target === modal) {
    modal.style.display = "none";
  }
};
 

