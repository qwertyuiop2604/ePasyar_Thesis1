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
  const urlParams = new URLSearchParams(window.location.search);
  const establishmentId = urlParams.get('id');
  
  try {
    // Reference to the user_reviews subcollection under the establishment
    const userReviewsCollectionRef = collection(db, `ratings/Tourist Spot/Tourist Spot_reviews/${establishmentId}/user_reviews`);
    
    // Query all documents in the user_reviews subcollection
    const userReviewsQuerySnapshot = await getDocs(userReviewsCollectionRef);

    // Process each review document
    userReviewsQuerySnapshot.forEach((doc) => {
      if (doc.exists()) {
        const reviewData = doc.data();

        const roundedAverageRating = (Math.round(reviewData.rating * 10) / 10).toFixed(1);

        const trow = document.createElement('tr');
        trow.innerHTML = `
          <td>${reviewData.email}</td>
          <td>${reviewData.review_text}</td>
          <td>${roundedAverageRating}</td>
          <td>${reviewData.timestamp}</td
        `;
        tbody.appendChild(trow);
      } else {
        console.error("No such review document!");
      }
    });
  } catch (error) {
    console.error("Error retrieving reviews data:", error);
  }
});