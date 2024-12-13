import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getFirestore,collection, getDocs, updateDoc, doc, setDoc, deleteDoc   } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";

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

// Function to handle navigation
document.getElementById("bckbtn").addEventListener('click', () => {
  window.location = 'tourist.html';
});

document.getElementById("events").addEventListener('click', () => {
  window.location = 'events.html';
});

let rewards = document.getElementById("reward");
rewards.addEventListener("click", () => {
  window.location = "redeem.html";
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
let graph = document.getElementById("graph");
graph.addEventListener("click", () => {
  window.location = "table.html";
});
// Fetch archived data and populate the table
(async () => {
  const archivedTbody = document.getElementById("archived-tbody");

  const querySnap = await getDocs(collection(db, "vigan_establishments"));
  querySnap.forEach((doc) => {
    if (doc.data().Status === "TS Shop Closed") {
      const trow = document.createElement("tr");
      trow.innerHTML = `
        <td>${doc.data().ArchivedBy}</td>
        <td>${doc.data().Name}</td>
        <td>${doc.data().Description}</td>
         <td><img src="${doc.data().PhotoURL}" alt="Event Photo" width="150" height="150"></td>   
        <td>${doc.data().ArchivedDate}</td>
      `;
      archivedTbody.appendChild(trow);

      // Event listener to set localStorage ID and highlight row
      trow.addEventListener('click', () => {
        localStorage.setItem('ID', doc.id);
        highlightRow(trow);
      });
    }
  });
})();
function toggleBlur(shouldBlur) {
  const container = document.querySelector('.main-container'); // Select the common container
  if (shouldBlur) {
    container.classList.add('blur-background');
  } else {
    container.classList.remove('blur-background');
  }
}

// Function to highlight the selected table row
function highlightRow(row) {
  const tableRows = document.querySelectorAll("#archived-tbody tr");
  tableRows.forEach(row => row.classList.remove("selected-row"));
  row.classList.add("selected-row");
}

// Event listener for enabling a closed event
document.getElementById('enabledTourist').addEventListener('click', () => {
  document.getElementById('cnfrm_modal_enable').style.display = "block";
});

// Event listener for cancel button in enable confirmation modal
document.getElementById('cnl').addEventListener('click', () => {
  document.getElementById('cnfrm_modal_enable').style.display = "none";
});

// Event listener for confirm button in enable confirmation modal
document.getElementById('cnfrm').addEventListener('click', async () => {
  try {
    const updateStats = doc(db, "vigan_establishments", localStorage.getItem("ID"));
    await updateDoc(updateStats, {
      Status: "TS Shop Open",
      ArchivedBy: "",
      ArchivedDate: ""
    });
    window.location = "tArchives.html";
    window.location.reload();
  } catch (error) {
    console.error("Error enabling document: ", error);
  }
});

// Event listener for permanently deleting an event
document.getElementById('permanentlyDelete').addEventListener('click', () => {
  document.getElementById('cnfrm_modal_delete').style.display = "block";
});

// Event listener for cancel button in delete confirmation modal
document.getElementById('cnl_delete').addEventListener('click', () => {
  document.getElementById('cnfrm_modal_delete').style.display = "none";
});

// Event listener for confirm button in delete confirmation modal
document.getElementById('cnfrm_delete').addEventListener('click', async () => {
  try {
    const docRef = doc(db, "vigan_establishments", localStorage.getItem("ID"));
    await deleteDoc(docRef);
    window.location = "tArchives.html";
    window.location.reload();
  } catch (error) {
    console.error("Error deleting document: ", error);
  }
});


// Get the modal elements
let logoutModal = document.getElementById("logout");
let modal = document.getElementById("logoutModal");
let closeBtn = document.getElementsByClassName("close")[0];
let confirmBtn = document.getElementById("confirmLogout");
let cancelBtn = document.getElementById("cancelLogout");
let logout = document.getElementById("logout");

// Show the logout modal when the logout button is clicked
logout.addEventListener("click", (event) => {
  event.preventDefault(); // Prevent default link behavior
  modal.style.display = "block"; // Show the logout modal
});

// Close the modal when the "x" button is clicked
closeBtn.onclick = function() {
  modal.style.display = "none"; // Hide the modal
};

// Close the modal when the cancel button is clicked
cancelBtn.onclick = function() {
  modal.style.display = "none"; // Hide the modal
};

// Confirm logout when the user clicks "Yes, Log Out"
confirmBtn.onclick = function() {
  // Clear session and localStorage data
  localStorage.removeItem("ID");  // Remove user session data from localStorage
  sessionStorage.clear();         // Clear all session data

  // Redirect to the login page and prevent back navigation
  window.location.href = "index.html";
  history.pushState(null, null, window.location.href);
  window.onpopstate = function(event) {
    history.go(1);
  };
};

// Check if the user is logged out (by checking sessionStorage or localStorage)
if (!sessionStorage.getItem("ID") && !localStorage.getItem("ID")) {
  // Ensure user cannot navigate back to the page after logout
  window.onpopstate = function(event) {
    history.go(1);
  };
}

// Prevent back navigation after logout
window.addEventListener("load", function() {
  window.history.forward();
});

// Prevent back navigation after logout
window.onunload = function() {
  null;
};

// Define the preventBack function
function preventBack() {
  window.history.forward();
}

// Call the preventBack function
setTimeout(preventBack, 0);
// Close the modal when clicking outside of it
window.onclick = function(event) {
  if (event.target === modal) {
    modal.style.display = "none";
  }
};
 