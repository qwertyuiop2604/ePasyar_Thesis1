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

let activities = document.getElementById("activities");
activities.addEventListener("click", () => {
  window.location = "activities.html";
});
let user = document.getElementById("user");
user.addEventListener("click", () => {
  window.location = "user.html";
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

// Function to Retrieve User Logs
async function getUserLogs() {
    try {
      // Reference the `userLog` collection
      const userLogRef = collection(db, "userLog");
      const snapshot = await getDocs(userLogRef);
  
      // Clear the table body before appending new data
      const tableBody = document.getElementById("tbody1");
      tableBody.innerHTML = "";
  
      // Check if the collection has documents
      if (snapshot.empty) {
        console.log("No user logs found.");
        return;
      }
  
      // Iterate through each document
      snapshot.forEach((doc) => {
        const logData = doc.data();
  
        // Create a table row for each log
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${logData.fName || "N/A"}</td>
          <td>${logData.lName || "N/A"}</td>
          <td>${logData.Activity || "N/A"}</td>
        `;
        tableBody.appendChild(row);
      });
  
      console.log("User logs retrieved successfully.");
    } catch (error) {
      console.error("Error retrieving user logs:", error);
    }
  }
  
  // Call the function to load user logs on page load
  document.addEventListener("DOMContentLoaded", () => {
    getUserLogs();
  });
  