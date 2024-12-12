import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-app.js";
import {
  getFirestore,
  addDoc,
  collection,
  getDocs,
  updateDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/9.1.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyA6U1In2wlItYioP3yl43C3hCgiXUZ4oKI",
  authDomain: "epasyar-aa569.firebaseapp.com",
  databaseURL: "https://epasyar-aa569-default-rtdb.firebaseio.com",
  projectId: "epasyar-aa569",
  storageBucket: "epasyar-aa569.appspot.com",
  messagingSenderId: "1004550371893",
  appId: "1:1004550371893:web:692e667675470640980f7c",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

let dash = document.getElementById("dash");
dash.addEventListener("click", () => {
  window.location = "dash.html";
});
let profile = document.getElementById("profile");
profile.addEventListener("click", () => {
  window.location = "profile.html";
});
let promotion = document.getElementById("promotion");
promotion.addEventListener("click", () => {
  window.location = "promotion.html";
});
let events = document.getElementById("events");
events.addEventListener("click", () => {
  window.location = "events.html";
});
let tourist = document.getElementById("tourist");
tourist.addEventListener("click", () => {
  window.location = "tourist.html";
});

let restaurant = document.getElementById("restaurant");
restaurant.addEventListener("click", () => {
  window.location = "restaurants.html";
});

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

async function loadTableData() {
  const tableBody = document.getElementById("tbody1");

  try {
    const querySnapshot = await getDocs(collection(db, "users")); 
    tableBody.innerHTML = ""; 

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const fName = data.fName || "Unknown"; 
      const totalPoints = data.points?.totalPoints || 0; 
      const Status = data.pointsRedeemed ? "Redeemed" : "Not Redeemed";  // Check the pointRedeemed field

      const row = `
        <tr>
          <td>${fName}</td>
          <td>${totalPoints}</td>
          <td>${Status}</td>  
        </tr>`;
      tableBody.innerHTML += row;
    });

    // Add event listeners to dynamically created buttons
    const redeemButtons = document.querySelectorAll('.redeem-btn');
    redeemButtons.forEach(button => {
      button.addEventListener('click', (event) => {
        const docId = event.target.getAttribute('data-doc-id');
        redeemPoints(docId); // Call redeemPoints when button is clicked
      });
    });

    if (querySnapshot.empty) {
      tableBody.innerHTML = "<tr><td colspan='3'>No data available</td></tr>";
    }
  } catch (error) {
    console.error("Error loading table data:", error);
    tableBody.innerHTML = "<tr><td colspan='3'>Error loading data</td></tr>";
  }
}

  // Call the function when the page loads
 document.addEventListener("DOMContentLoaded", loadTableData);


 async function fetchAdminName() {
  try {
    const response = await fetch('admin');
    if (!response.ok) {
      console.error('Response status:', response.status);
      throw new Error('Failed to fetch admin data');
    }
    const data = await response.json();
    document.getElementById('admin_name').textContent = data.fname || 'Admin';
  } catch (error) {
    console.error('Error fetching admin name:', error.message);
    document.getElementById('admin_name').textContent = 'Admin'; // Fallback name
  }
}

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
