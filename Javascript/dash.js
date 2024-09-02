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

document.addEventListener('DOMContentLoaded', function () {
  var dropdown = document.querySelector('.dropdown-btn');
  var dropdownContent = document.querySelector('.dropdown-container');
  dropdown.addEventListener('click', function () {
    dropdownContent.classList.toggle('show');
  });
});

// Get the canvas element
const ctx = document.getElementById("mostVisitedChart").getContext("2d");

// Create the chart with initial data
const mostVisitedChart = new Chart(ctx, {
  type: "line",
  data: {
    labels: [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ],
    datasets: [
      {
        label: "Number of Visitors",
        data: [1,1], // Initial empty data
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  },
  options: {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
});

async function updateChartData(type) {
  try {
    let reportsRef;
    let dataKey;
    let label;
    let xLabels = [];

    if (type === "Daily") {
      reportsRef = collection(db, "tourist_arrival_reports", "daily", "daily_reports");
      dataKey = "total_tourist_per_daily";
      label = "Number of Visitors (Daily)";
      for (let i = 1; i <= 31; i++) xLabels.push(i); // Days of the month
    } else if (type === "Weekly") {
      reportsRef = collection(db, "tourist_arrival_reports", "weekly", "weekly_reports");
      dataKey = "total_tourist_per_weekly";
      label = "Number of Visitors (Weekly)";
    } else if (type === "Monthly") {
      reportsRef = collection(db, "tourist_arrival_reports", "monthly", "monthly_reports");
      dataKey = "total_tourist_per_monthly";
      label = "Number of Visitors (Monthly)";
      xLabels = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];
    } else if (type === "Yearly") {
      reportsRef = collection(db, "tourist_arrival_reports", "yearly", "yearly_reports");
      dataKey = "total_tourist_per_yearly";
      label = "Number of Visitors (Yearly)";
      for (let i = new Date().getFullYear() - 10; i <= new Date().getFullYear(); i++) xLabels.push(i); // Last 10 years
    } else {
      console.error("Invalid report type");
      return;
    }

    const querySnapshot = await getDocs(reportsRef);
    const visitorData = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const value = data[dataKey] || 0;
      visitorData.push(value);

      if (type === "Weekly") {
        xLabels.push(doc.id); // Use document IDs as labels for weekly reports
      }
    });

    // Update chart data
    mostVisitedChart.data.labels = xLabels;
    mostVisitedChart.data.datasets[0].data = visitorData;
    mostVisitedChart.data.datasets[0].label = label;
    mostVisitedChart.update();
  } catch (error) {
    console.error("Error fetching visitor data:", error);
  }
}

// Toggle hamburger menu
function toggleMenu() {
  var menuContent = document.getElementById("menuContent");
  if (menuContent.style.display === "block") {
    menuContent.style.display = "none";
  } else {
    menuContent.style.display = "block";
  }
}

// Event listeners for menu options
document.getElementById('menuContent').addEventListener('click', function(event) {
  if (event.target.tagName === 'A') {
    const type = event.target.textContent.trim();
    updateChartData(type);
  }
});

// Sample HTML for menu
/*
<div class="menu-content" id="menuContent">
  <a href="#section1">Daily</a>
  <a href="#section2">Weekly</a>
  <a href="#section3">Monthly</a>
  <a href="#section4">Yearly</a>
</div>
*/

// Fetch initial chart data for monthly reports by default
updateChartData("Monthly");




// Event listeners for menu options
document.getElementById('menuContent').addEventListener('click', function(event) {
  if (event.target.tagName === 'A') {
    const type = event.target.textContent.trim();
    updateChartData(type);
  }
});

// Sample HTML for menu
/*
<div class="menu-content" id="menuContent">
  <a href="#section1">Daily</a>
  <a href="#section2">Weekly</a>
  <a href="#section3">Monthly</a>
  <a href="#section4">Yearly</a>
</div>
*/

// Fetch initial chart data for monthly reports by default
updateChartData("Monthly");


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

const eventsRef = collection(db, "festivals");
const establishmentsRef = collection(db, "vigan_establishments");


// Counters


let eventsCount = 0;
let hotelCount = 0;
let touristCount = 0;
let restoCount = 0;
let souvenirCount = 0;


// Update functions


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



// Snapshot handlers
const handleEstablishmentsSnapshot = (snapshot, Category, updateFunction) => {
  const filteredDocs = snapshot.docs.filter(doc => doc.data().Category === Category);
  const count = filteredDocs.length;
  updateFunction(count);
};

// Specific handlers for each category
const handleHotelsSnapshot = (snapshot) => {
  handleEstablishmentsSnapshot(snapshot, "Hotel", updateHotelCountElement);
};

const handleTouristSnapshot = (snapshot) => {
  handleEstablishmentsSnapshot(snapshot, "Tourist Spot", updateTouristCountElement);
};

const handleRestoSnapshot = (snapshot) => {
  handleEstablishmentsSnapshot(snapshot, "Restaurant", updateRestoCountElement);
};

const handleSouvenirSnapshot = (snapshot) => {
  handleEstablishmentsSnapshot(snapshot, "Souvenir Shop", updateSouvenirCountElement);
};





const handleEventsSnapshot = (snapshot) => {
  eventsCount = snapshot.docs.length;
  updateEventsCountElement(eventsCount);
};





onSnapshot(eventsRef, handleEventsSnapshot, (error) => {
  console.error("Error fetching events:", error);
});

onSnapshot(establishmentsRef, (snapshot) => {
  handleHotelsSnapshot(snapshot);
  handleTouristSnapshot(snapshot);
  handleRestoSnapshot(snapshot);
  handleSouvenirSnapshot(snapshot);
}, (error) => {
  console.error("Error fetching establishments:", error);
});

