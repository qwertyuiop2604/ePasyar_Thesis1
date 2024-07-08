import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-app.js";
import { getFirestore, doc, getDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-firestore.js";

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
let souvenir = document.getElementById("souvenir");
souvenir.addEventListener('click', () =>{
  window.location = 'souvenir.html'});

let logout = document.getElementById("logout");
logout.addEventListener("click", () => {
  window.location = "index.html";
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
let restaurant = document.getElementById("restaurant");
restaurant.addEventListener("click", () => {
  window.location = "restaurants.html";
});
document.addEventListener('DOMContentLoaded', function () {
  var dropdown = document.querySelector('.dropdown-btn');
  var dropdownContent = document.querySelector('.dropdown-container');
  dropdown.addEventListener('click', function () {
    dropdownContent.classList.toggle('show');
  });
});

document.addEventListener('DOMContentLoaded', async () => {
  const tbody = document.getElementById('tbody1');
  const reviewsCollectionRef = collection(db, "ratings/Hotel/Hotel_reviews");
  const scansCollectionRef = collection(db, "total_scans/touristScans/hotel_scans");

  try {
    const querySnapshot = await getDocs(reviewsCollectionRef);

    for (const reviewDoc of querySnapshot.docs) {
      const reviewData = reviewDoc.data();
      const reviewDocId = reviewDoc.id;

      // Fetch the corresponding totalScans document
      const scanDocRef = doc(scansCollectionRef, reviewDocId);
      const scanDoc = await getDoc(scanDocRef);

      const totalScans = scanDoc.exists() ? scanDoc.data().totalScans : 0;

      // Round the average rating to the nearest tenth
      const roundedAverageRating = (Math.round(reviewData.average_rating * 10) / 10).toFixed(1);

      // Create table row with review and scan data
      const trow = document.createElement('tr');
      trow.innerHTML = `
        <td>${reviewData.name}</td>
        <td>${roundedAverageRating}</td>
        <td>${reviewData.total_reviews}</td>
        <td>${totalScans}</td>
        <td><button class="details-btn" data-id="${reviewDocId}">Show Details</button></td>
      `;
      tbody.appendChild(trow);

      // Add event listener for the button
      const detailsBtn = trow.querySelector('.details-btn');
      detailsBtn.addEventListener('click', () => {
        const reviewDocId = detailsBtn.getAttribute('data-id');
        window.location.href = `rev_hotel_details.html?id=${reviewDocId}`;
      });
    }
  } catch (error) {
    console.error("Error retrieving review or scan data:", error);
  }
});