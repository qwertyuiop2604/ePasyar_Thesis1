import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getFirestore, collection, getDocs, updateDoc, doc, setDoc, deleteDoc, getDoc,  } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";
import { getAuth, deleteUser } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";

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


document.getElementById("bckbtn").addEventListener('click', () => {
  window.location = 'profile.html';
});

document.getElementById("events").addEventListener('click', () => {
  window.location = 'events.html';
});


document.getElementById("otop").addEventListener("click", () => {
  window.location = "otop.html";
});

document.getElementById("localdishes").addEventListener("click", () => {
  window.location = "dishes.html";
});

document.getElementById("localindustries").addEventListener("click", () => {
  window.location = "industries.html";
});

document.getElementById("localindustries").addEventListener("click", () => {
  window.location = "industries.html";
});

let activities = document.getElementById("activities");

activities.addEventListener("click", () => {
  window.location = "activities.html";
});
let user = document.getElementById("user");

user.addEventListener("click", () => {
  window.location = "user.html";
});

const archivedTbody = document.getElementById("archived-tbody");

const querySnap = await getDocs(collection(db, "users", "admin", "admin_account"));
querySnap.forEach((doc) => {
  if (doc.data().status === "Deleted") { 
    const trow = document.createElement("tr");
    trow.innerHTML = `
      <td>${doc.data().deletedBy}</td>
      <td>${doc.data().name}</td>
      <td>${doc.data().email}</td>
      <td>${doc.data().deletedDate}</td>
    `;
    archivedTbody.appendChild(trow);
    trow.addEventListener('click', () => {
      localStorage.setItem('ID', doc.id);
      highlightRow(trow);
    });
  }
});

function highlightRow(row) {
  const rows = document.querySelectorAll('tr.selected-row');
  rows.forEach(row => row.classList.remove('selected-row'));
  row.classList.add('selected-row');
}

// HIGHLIGHT TABLE ROW WHEN CLICKED - FINAL
var table = document.getElementById("table");
var rows = document.getElementsByTagName('tr');
for (let i = 1; i < rows.length; i++) {
  var currentRow = table.rows[i];
  currentRow.onclick = function () {
    Array.from(this.parentElement.children).forEach(function (el) {
      el.classList.remove('selected-row');
    });
    this.classList.add('selected-row');
    document.getElementById("enabledbtn").disabled = false;
  }
}

const enabledbtn = document.getElementById('enabledbtn');
if (enabledbtn) {
  enabledbtn.addEventListener('click', () => {
    document.getElementById('cnfrm_modal_retrieve').style.display = "block";
  });
}

document.getElementById("enabledbtn").disabled = true; 

// Confirm and cancel actions for enabling user
document.getElementById('cnl_rtv').addEventListener('click', () => {
  document.getElementById('cnfrm_modal_retrieve').style.display = "none";
});

document.getElementById('cnfrm_rtv').addEventListener('click', async () => {
  const docRef = doc(db, "users", "admin", "admin_account", localStorage.getItem("ID"));
  await updateDoc(docRef, {
    status: "Active",
    ArchivedBy: "",
    ArchivedDate: ""
  }).then(() => {
    window.location = "prArchives.html";
    window.location.reload();
  });
});

// Event listener for permanently deleting an user
document.getElementById('permanentlyDelete').addEventListener('click', () => {
  document.getElementById('cnfrm_modal_delete').style.display = "block";
});

// Event listener for cancel button in delete confirmation modal
document.getElementById('cnl_delete').addEventListener('click', () => {
  document.getElementById('cnfrm_modal_delete').style.display = "none";
});

// Event listener for confirm button in delete confirmation modal
document.getElementById('cnfrm_delete').addEventListener('click', async () => {
  const userId = localStorage.getItem("ID"); // Assume you store the user ID here

  try {
    const docRef = doc(db, 'users', 'admin', 'admin_account', userId);
    
    // Fetch user data to get the UID before deleting
    const userDoc = await getDoc(docRef);
    if (!userDoc.exists()) {
      throw new Error("User does not exist in Firestore.");
    }

    const userUID = userDoc.data().uid; // Adjust this according to your Firestore structure

    // Delete user from Firestore
    await deleteDoc(docRef);
    
    // Delete user from Firebase Authentication using UID
    await deleteUser(auth.getUser(userUID))
      .then(() => {
        console.log("User deleted from Authentication");
      })
      .catch((error) => {
        console.error("Error deleting user from Authentication: ", error);
        alert("Error deleting user from Authentication: " + error.message);
      });

    document.getElementById('cnfrm_modal_delete').style.display = "none"; // Close the modal on success
    window.location = "prArchives.html"; // Redirect after deletion
  } catch (error) {
    console.error("Error deleting document: ", error);
    alert("Error deleting document: " + error.message); // Provide feedback to the user
  }
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
