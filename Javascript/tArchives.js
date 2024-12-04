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

document.getElementById("reviews").addEventListener("click", () => {
  window.location = "reviews.html";
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

let activities = document.getElementById("activities");

activities.addEventListener("click", () => {
  window.location = "activities.html";
});
let user = document.getElementById("user");

user.addEventListener("click", () => {
  window.location = "user.html";
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
 