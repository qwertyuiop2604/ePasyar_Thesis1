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

let bck = document.getElementById("bck");
bck.addEventListener("click", () => {
  window.location = "restaurants.html";
});

// Get the document ID from the URL parameters
const urlParams = new URLSearchParams(window.location.search);
const documentID = urlParams.get('docId');  // Get the docId from the URL
console.log("Retrieved document ID from URL:", documentID);  // Log the retrieved document ID

if (documentID) {
  // Fetch and display the reviews for the document ID
  getReviews(documentID);
} else {
  console.error("No document ID found in URL!");  // If no document ID found, log this error
}

// Event listeners for navigation (no changes here)
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
souvenir.addEventListener('click', () => {
  window.location = 'souvenir.html'
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

// Function to generate stars based on rating
// Function to generate stars based on rating with smaller size
function generateStars(rating) {
  let stars = '';
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars += '<i class="fas fa-star" style="color: gold; font-size: 16px;"></i>'; // Full star with smaller size
    } else {
      stars += '<i class="far fa-star" style="color: gold; font-size: 16px;"></i>'; // Empty star with smaller size
    }
  }
  return stars;
}


// Retrieve and display the establishment name and reviews
async function getEstablishmentName(documentID) {
  try {
    // Reference to the document containing the establishment name
    const touristSpotRef = doc(db, 'vigan_establishments', documentID);
    console.log("Fetching tourist spot name from:", touristSpotRef.path);  // Log the path of the document

    // Fetch the document snapshot for the establishment name
    const touristSpotSnapshot = await getDoc(touristSpotRef);

    if (touristSpotSnapshot.exists()) {
      // Get the establishment name from the document's 'Name' field
      const establishmentName = touristSpotSnapshot.data().Name;

      // Set the touristName element to the fetched establishment name + " Reviews"
      const touristNameElement = document.getElementById('touristName');
      if (touristNameElement) {
        touristNameElement.innerHTML = `${establishmentName} Reviews `; // Set the name as HTML (not textContent)
        
        // Fetch the rating from the ratings collection
        const ratingsRef = doc(db, 'ratings', 'Restaurant', 'Restaurant_reviews', documentID);
        const ratingsSnapshot = await getDoc(ratingsRef);
        
        if (ratingsSnapshot.exists()) {
          // Get the rating value and round it to one decimal place
          const totalAverageRating = ratingsSnapshot.data().total_average_rating;
          const roundedRating = totalAverageRating ? Math.round(totalAverageRating * 10) / 10 : 0.0; // Round to one decimal place

          // Generate stars based on the rounded rating
          const stars = generateStars(roundedRating); // Generate the stars based on the rating

          // Append the stars to the tourist name element
          touristNameElement.innerHTML += `${stars} <span>(${roundedRating})</span>`; // Display the stars and rating number
          console.log(`Set tourist name to: ${establishmentName} Reviews with rating: ${roundedRating}`); // Log the name and rating
        } else {
          console.error("Rating document not found!");
        }
      } else {
        console.error("Element with id 'touristName' not found!");
      }
    } else {
      console.error("Tourist spot document not found!");
    }
  } catch (error) {
    console.error("Error retrieving establishment name or rating:", error);
  }
}

// Call the function to retrieve and set the tourist spot name and rating
if (documentID) {
  getEstablishmentName(documentID);  // Fetch and display the establishment name
  getReviews(documentID);  // Also call to fetch reviews
} else {
  console.error("No document ID found in URL!");
}



// Retrieve and display reviews with dynamic document ID
// Retrieve and display reviews with dynamic document ID
async function getReviews(documentID) {
  try {
    const allReviews = [];
    const reviewsRef = collection(db, 'ratings', 'Restaurant', 'Restaurant_reviews', documentID, 'user_reviews');

    // Retrieve all documents from the 'user_reviews' subcollection
    const userDocs = await getDocs(reviewsRef);

    // Iterate through each document (representing a user review)
    for (const userDoc of userDocs.docs) {
      const userID = userDoc.id; // User ID (if needed for reference)
      const userReviewRef = doc(db, 'ratings', 'Restaurant', 'Restaurant_reviews', documentID, 'user_reviews', userID);

      // Retrieve the review details for this user
      const userReviewSnapshot = await getDoc(userReviewRef);

      if (userReviewSnapshot.exists()) {
        const review = userReviewSnapshot.data();
        console.log(`User Review Data for ${userID}:`, review);

        

        // Add to allReviews array with rounded ratings
        allReviews.push({
          fname: review.fname || 'No email',
          review_text: review.review_text || 'No review text',
          average_rating1: review.rating1 !== undefined ? Math.round(review.rating1 * 10) / 10 : 'N/A',
          average_rating2: review.rating2 !== undefined ? Math.round(review.rating2 * 10) / 10 : 'N/A',
          average_rating3: review.rating3 !== undefined ? Math.round(review.rating3 * 10) / 10 : 'N/A',
          timestamp: review.timestamp || 'No timestamp'
        });
      }
    }

    // Step 2: Display combined reviews in the table
    displayCombinedReviews(allReviews);
  } catch (error) {
    console.error("Error retrieving reviews: ", error);
  }
}

// Function to display all combined reviews in the table
function displayCombinedReviews(reviews) {
  const tableBody = document.querySelector('tbody');
  
  // Ensure that the table body exists
  if (tableBody) {
    tableBody.innerHTML = ''; // Clear the table before adding new rows

    reviews.forEach((review) => {
      const row = document.createElement('tr');

      row.innerHTML = `
        <td>${review.fname}</td>
        <td>${review.review_text}</td>
        <td>${review.average_rating1}</td>
        <td>${review.average_rating2}</td>
        <td>${review.average_rating3}</td>
        <td>${review.timestamp}</td>
      `;

      tableBody.appendChild(row);
    });
  } else {
    console.error("Table body element not found!");
  }
}

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