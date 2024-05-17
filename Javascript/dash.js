import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  onSnapshot,
} from "https://www.gstatic.com/firebasejs/9.1.1/firebase-firestore.js";

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

let profile = document.getElementById("profile");
profile.addEventListener("click", () => {
  window.location = "profile.html";
});
let users = document.getElementById("users");
users.addEventListener("click", () => {
  window.location = "profile.html";
});
let hotels = document.getElementById("hOtels");
hotels.addEventListener("click", () => {
  window.location = "promotion.html";
});

let resto = document.getElementById("resto");
resto.addEventListener("click", () => {
  window.location = "restaurants.html";
});

let events = document.getElementById("events");

events.addEventListener("click", () => {
  window.location = "events.html";
});

let dashboard = document.getElementById("dashboard");

dashboard.addEventListener("click", () => {
  window.location = "dash.html";
});

let promotion = document.getElementById("promotion");
promotion.addEventListener("click", () => {
  window.location = "promotion.html";
});
let tourist = document.getElementById("tourist");
tourist.addEventListener("click", () => {
  window.location = "tourist.html";
});
let tourists = document.getElementById("tourists");
tourists.addEventListener("click", () => {
  window.location = "tourist.html";
});
let souvenir = document.getElementById("souvenir");
souvenir.addEventListener("click", () => {
  window.location = "souvenir.html";
});
let souvenirs = document.getElementById("souvenirs");
souvenirs.addEventListener("click", () => {
  window.location = "souvenir.html";
});
let admin = document.getElementById("admin");
admin.addEventListener("click", () => {
  window.location = "profile.html";
});
let event = document.getElementById("eventS");
event.addEventListener("click", () => {
  window.location = "events.html";
});

let restaurant = document.getElementById("restaurant");
restaurant.addEventListener("click", () => {
  window.location = "restaurants.html";
});

let logout = document.getElementById("logout");
logout.addEventListener("click", () => {
  window.location = "index.html";
});
let reviews = document.getElementById("reviews");
reviews.addEventListener("click", () => {
  window.location = "reviews.html";
});

// Sample data for most visited locations
const mostVisitedData = {
  labels: [
    "Location 1",
    "Location 2",
    "Location 3",
    "Location 4",
    "Location 5",
  ],
  datasets: [
    {
      label: "Number of Visitors",
      data: [100, 200, 150, 250, 180], // Replace with your actual data
      backgroundColor: [
        "rgba(255, 99, 132, 0.2)",
        "rgba(54, 162, 235, 0.2)",
        "rgba(255, 206, 86, 0.2)",
        "rgba(75, 192, 192, 0.2)",
        "rgba(153, 102, 255, 0.2)",
      ],
      borderColor: [
        "rgba(255, 99, 132, 1)",
        "rgba(54, 162, 235, 1)",
        "rgba(255, 206, 86, 1)",
        "rgba(75, 192, 192, 1)",
        "rgba(153, 102, 255, 1)",
      ],
      borderWidth: 1,
    },
  ],
};

// Get the canvas element
const ctx = document.getElementById("mostVisitedChart").getContext("2d");

// Create the bar chart
const mostVisitedChart = new Chart(ctx, {
  type: "bar",
  data: mostVisitedData,
  options: {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
});
async function fetchTourists() {
  const touristsTable = document.getElementById("touristsTableBody");

  // Clear existing rows
  touristsTable.innerHTML = "";

  try {
    // Fetch data from Firestore
    const querySnapshot = await getDocs(collection(db, "users"));

    // Iterate over the documents and populate the table
    querySnapshot.forEach((doc) => {
      const userData = doc.data();
      const row = `<tr>
                    
                    <td>${userData.fName}</td>
                    <td>${userData.lName}</td>
                    <td>${userData.email}</td>
                    <td>${userData.country}</td>
                    <td>${userData.password}</td>
                  </tr>`;
      touristsTable.innerHTML += row;
    });
  } catch (error) {
    console.error("Error fetching tourists:", error);
  }
}

// Call the function to fetch and populate the table
fetchTourists();

// Firestore references
const usersRef = collection(db, "users");
const adminsRef = collection(db, "users", "admin", "admin_account");
const eventsRef = collection(db, "festivals");
const hotelsRef = collection(db, "vigan_establishments");
const touristRef = collection(db, "vigan_establishments");
const restoRef = collection(db, "vigan_establishments");
const souvenirRef = collection(db, "vigan_establishments");
const totalRef = collection(db, "total_scans");

// Counters
let userCount = 0;
let adminCount = 0;
let eventsCount = 0;
let hotelCount = 0;
let touristCount = 0;
let restoCount = 0;
let souvenirCount = 0;
let totalCount = 0;

// Update functions
const updateUserCountElement = (count) => {
  const userCountElement = document.getElementById("userCount");
  if (userCountElement) {
    userCountElement.textContent = `${count}`;
  }
};

const updateAdminCountElement = (count) => {
  const adminCountElement = document.getElementById("adminCount");
  if (adminCountElement) {
    adminCountElement.textContent = `${count}`;
  }
};

const updateEventsCountElement = (count) => {
  const eventsCountElement = document.getElementById("eventsCount");
  if (eventsCountElement) {
    eventsCountElement.textContent = `${count}`;
  }
};

const updateHotelCountElement = (count) => {
  const hotelCountElement = document.getElementById("hotelCount");
  if (hotelCountElement) {
    hotelCountElement.textContent = `${count}`;
  }
};

const updateTouristCountElement = (count) => {
  const touristCountElement = document.getElementById("touristCount");
  if (touristCountElement) {
    touristCountElement.textContent = `${count}`;
  }
};

const updateRestoCountElement = (count) => {
  const restoCountElement = document.getElementById("restoCount");
  if (restoCountElement) {
    restoCountElement.textContent = `${count}`;
  }
};

const updateSouvenirCountElement = (count) => {
  const souvenirCountElement = document.getElementById("souvenirCount");
  if (souvenirCountElement) {
    souvenirCountElement.textContent = `${count}`;
  }
};

const updateTotalCountElement = (count) => {
  const totalCountElement = document.getElementById("totalCount");
  if (totalCountElement) {
    totalCountElement.textContent = `${count}`;
  }
};

// Snapshot handlers
const handleUsersSnapshot = (snapshot) => {
  const users = snapshot.docs;
  userCount = users.length;
  updateUserCountElement(userCount);
};

const handleAdminsSnapshot = (snapshot) => {
  const admins = snapshot.docs;
  adminCount = admins.length;
  updateAdminCountElement(adminCount);
};

const handleEventsSnapshot = (snapshot) => {
  const events = snapshot.docs;
  eventsCount = events.length;
  updateEventsCountElement(eventsCount);
};

const handleHotelsSnapshot = (snapshot) => {
  const hotels = snapshot.docs;
  hotelCount = hotels.length;
  updateHotelCountElement(hotelCount);
};

const handleTouristSnapshot = (snapshot) => {
  const tourists = snapshot.docs;
  touristCount = tourists.length;
  updateTouristCountElement(touristCount);
};

const handleRestoSnapshot = (snapshot) => {
  const restos = snapshot.docs;
  restoCount = restos.length;
  updateRestoCountElement(restoCount);
};

const handleSouvenirSnapshot = (snapshot) => {
  const souvenirs = snapshot.docs;
  souvenirCount = souvenirs.length;
  updateSouvenirCountElement(souvenirCount);
};

const handleTotalSnapshot = (snapshot) => {
  const total = snapshot.docs;
  totalCount = total.length;
  updateTotalCountElement(totalCount);
};

// Setup Firestore listeners
onSnapshot(usersRef, handleUsersSnapshot, (error) => {
  console.error("Error fetching users:", error);
});

onSnapshot(adminsRef, handleAdminsSnapshot, (error) => {
  console.error("Error fetching admins:", error);
});

onSnapshot(eventsRef, handleEventsSnapshot, (error) => {
  console.error("Error fetching events:", error);
});

onSnapshot(hotelsRef, handleHotelsSnapshot, (error) => {
  console.error("Error fetching hotels:", error);
});

onSnapshot(touristRef, handleTouristSnapshot, (error) => {
  console.error("Error fetching tourist spots:", error);
});

onSnapshot(restoRef, handleRestoSnapshot, (error) => {
  console.error("Error fetching restaurants:", error);
});

onSnapshot(souvenirRef, handleSouvenirSnapshot, (error) => {
  console.error("Error fetching souvenir shops:", error);
});

onSnapshot(totalRef, handleTotalSnapshot, (error) => {
  console.error("Error fetching total scans:", error);
});
