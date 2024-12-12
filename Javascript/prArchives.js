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

let rewards = document.getElementById("reward");
rewards.addEventListener("click", () => {
  window.location = "redeem.html";
});


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


const archivedTbody = document.getElementById("archived-tbody");


const querySnap = await getDocs(collection(db,"admin",));
querySnap.forEach((doc) => {
  if (doc.data().status === "Deleted") {
    const trow = document.createElement("tr");
    trow.innerHTML = `
      <td>${doc.data().ArchivedBy}</td>
      <td>${doc.data().fname}</td>
       <td>${doc.data().lname}</td>
      <td>${doc.data().email}</td>
      <td>${doc.data().ArchivedDate}</td>
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

//HIGHLIGHT TABLE ROW WHEN CLICKED - FINAL
var table = document.getElementById("table");
var rows = document.getElementsByTagName("tr");
for (let i = 1; i < rows.length; i++) {
  var currentRow = table.rows[i];
  currentRow.onclick = function () {
    Array.from(this.parentElement.children).forEach(function (el) {
      el.classList.remove("selected-row");
    });

    // [...this.parentElement.children].forEach((el) => el.classList.remove('selected-row'));
    this.classList.add("selected-row");

    document.getElementById("enabledbtn").disabled = false;
  };
}
// window.onload = GetAllDataOnce;

document.getElementById('enabledbtn').addEventListener('click', () => {
  document.getElementById('cnfrm_modal_enable').style.display = "block";
});

document.getElementById('cnl').addEventListener('click', () => {
  document.getElementById('cnfrm_modal_enable').style.display = "none";
});

const querySnap2 = await getDocs(collection(db, "admin"));
querySnap2.forEach((doc2) => {
  document.getElementById('cnfrm').addEventListener('click', (e) => {
    const updateStats = doc(db, "admin", localStorage.getItem("ID"));
  
    updateDoc(updateStats, {
      status: "Active",
      ArchivedBy: "",
      ArchivedDate: ""
    }).then(() => {
      window.location = "prArchives.html";
      window.location.reload();
    });
  });
});

// Event listener for permanently deleting a user
document.getElementById('permanentlyDelete').addEventListener('click', () => {
  document.getElementById('cnfrm_modal_delete').style.display = "block";
});

// Event listener for cancel button in delete confirmation modal
document.getElementById('cnl_delete').addEventListener('click', () => {
  document.getElementById('cnfrm_modal_delete').style.display = "none";
});

// Event listener for confirm button in delete confirmation modal
document.getElementById('cnfrm_delete').addEventListener('click', async () => {
  const userId = localStorage.getItem("ID"); // Ensure the user ID is stored in localStorage

  if (!userId) {
    showErrorModal("User ID not found. Please log in again.");
    return;
  }

  try {
    const docRef = doc(db, 'admin', userId);

    // Fetch user data to get the UID before deleting
    const userDoc = await getDoc(docRef);
    if (!userDoc.exists()) {
      throw new Error("User does not exist in Firestore.");
    }

    const userUID = userDoc.data().uid; // Adjust according to your Firestore structure

    // Delete user from Firestore
    await deleteDoc(docRef);

    // Get the current user from Firebase Authentication and delete them
    const currentUser = auth.currentUser; // Get the current authenticated user

    if (currentUser && currentUser.uid === userUID) {
      await deleteUser(currentUser);
      console.log("User deleted from Authentication");
    } else {
      throw new Error("Authenticated user does not match the target user.");
      
    }    

    // Close the modal on success
    document.getElementById('cnfrm_modal_delete').style.display = "none";

    // Redirect after deletion
    window.location = "prArchives.html";
    
  } catch (error) {
    console.error("Error deleting user:", error);
    showErrorModal("Failed to delete user: " + error.message);
  }
      window.location.reload();
});

// Function to show error modal with a message
function showErrorModal(message) {
  document.getElementById('errorMessage').textContent = message; // Set the error message
  document.getElementById('errorModal').style.display = "block"; // Show the modal
}

// Close the error modal when the user clicks on <span> (x)
document.getElementById('closeErrorModal').addEventListener('click', () => {
  document.getElementById('errorModal').style.display = "none";
});

// Close the error modal if the user clicks outside the modal content
window.addEventListener('click', (event) => {
  if (event.target === document.getElementById('errorModal')) {
    document.getElementById('errorModal').style.display = "none";
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



