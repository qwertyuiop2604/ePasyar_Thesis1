import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  onSnapshot,
} from "https://www.gstatic.com/firebasejs/9.1.1/firebase-firestore.js";
// import { jsPDF } from "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";

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

// Importing libraries
const { jsPDF } = window.jspdf;
const XLSX = window.XLSX;

// Function to capture chart as an image and generate PDF
async function generatePDFReport() {
  const doc = new jsPDF();
  
  // Capture the chart as an image
  const chartCanvas = document.getElementById("mostVisitedChart");
  if (chartCanvas) {
    const chartImage = chartCanvas.toDataURL("image/png", 1.0);
    doc.text("Tourist Report", 20, 10);
    doc.addImage(chartImage, "PNG", 15, 20, 180, 80); // Adjust positioning and size
  }

  // Fetch all data in parallel
  const [dailyData, weeklyData, monthlyData, yearlyData] = await Promise.all([
    getDataArray("Daily"),
    getDataArray("Weekly"),
    getDataArray("Monthly"),
    getDataArray("Yearly")
  ]);

  // Formatting and adding fetched data to PDF
  let yOffset = 110;
  const addDataToPDF = (title, data) => {
    doc.text(`${title} Report:`, 20, yOffset);
    yOffset += 10;
    data.forEach(([date, count]) => {
      doc.text(`${date}: ${count}`, 20, yOffset);
      yOffset += 8;
    });
    yOffset += 10;
  };

  addDataToPDF("Daily", dailyData);
  addDataToPDF("Weekly", weeklyData);
  addDataToPDF("Monthly", monthlyData);
  addDataToPDF("Yearly", yearlyData);

  // Save the PDF
  doc.save("TouristReport.pdf");
}

// Function to export data to Excel
async function generateExcelReport() {
  const workbook = XLSX.utils.book_new();

  // Fetch all data in parallel
  const [dailyData, weeklyData, monthlyData, yearlyData] = await Promise.all([
    getDataArray("Daily"),
    getDataArray("Weekly"),
    getDataArray("Monthly"),
    getDataArray("Yearly")
  ]);

  // Create worksheets for each report type
  const createSheet = (title, data) => {
    const sheet = XLSX.utils.aoa_to_sheet([["Date", "Count"], ...data]);
    XLSX.utils.book_append_sheet(workbook, sheet, title);
  };

  createSheet("Daily Report", dailyData);
  createSheet("Weekly Report", weeklyData);
  createSheet("Monthly Report", monthlyData);
  createSheet("Yearly Report", yearlyData);

  // Save the workbook
  XLSX.writeFile(workbook, "TouristReport.xlsx");
}

// Helper function to fetch data in array format
async function getDataArray(type) {
  const dataArray = [];
  const reportsRef = getReportsRef(type);
  const querySnapshot = await getDocs(reportsRef);

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const value = data[getDataKey(type)] || 0;
    dataArray.push([doc.id, value]);
  });

  return dataArray;
}

// Function to get Firestore reference based on report type
function getReportsRef(type) {
  if (type === "Daily") return collection(db, "tourist_arrival_reports", "daily", "daily_reports");
  if (type === "Weekly") return collection(db, "tourist_arrival_reports", "weekly", "weekly_reports");
  if (type === "Monthly") return collection(db, "tourist_arrival_reports", "monthly", "monthly_reports");
  if (type === "Yearly") return collection(db, "tourist_arrival_reports", "yearly", "yearly_reports");
}

// Helper function to map report type to specific data key
function getDataKey(type) {
  switch (type) {
    case "Daily":
      return "dailyCount";
    case "Weekly":
      return "weeklyCount";
    case "Monthly":
      return "monthlyCount";
    case "Yearly":
      return "yearlyCount";
    default:
      return "count";
  }
}

// Event listeners for report generation buttons
document.getElementById("generatePDF").addEventListener("click", generatePDFReport);
document.getElementById("generateExcel").addEventListener("click", generateExcelReport);



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

// Get the canvas element for the tourist spots chart
const touristCtx = document.getElementById("touristSpotsChart").getContext("2d");

// Create the bar chart for tourist spots
const touristSpotsChart = new Chart(touristCtx, {
  type: "bar",
  data: {
    labels: [], // Initially empty, will be populated from Firebase
    datasets: [{
      label: "Number of Tourist Spot Visitors",
      data: [], // Initially empty, will be populated from Firebase
      backgroundColor: [
        "rgba(75, 192, 192, 0.2)",
        "rgba(54, 162, 235, 0.2)",
        "rgba(255, 206, 86, 0.2)",
        "rgba(153, 102, 255, 0.2)",
        "rgba(255, 159, 64, 0.2)",
        "rgba(201, 203, 207, 0.2)",
        "rgba(255, 99, 132, 0.2)"
      ],
      borderColor: [
        "rgba(75, 192, 192, 1)",
        "rgba(54, 162, 235, 1)",
        "rgba(255, 206, 86, 1)",
        "rgba(153, 102, 255, 1)",
        "rgba(255, 159, 64, 1)",
        "rgba(201, 203, 207, 1)",
        "rgba(255, 99, 132, 1)"
      ],
      borderWidth: 2  
    }]
  },
  options: {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
});
// Function to fetch tourist spot data from Firestore
async function fetchTouristSpotData() {
  try {
    const touristScansRef = collection(db, "total_scans/touristScans/touristspot_scans");
    const querySnapshot = await getDocs(touristScansRef);


    const labels = [];
    const data = [];


    querySnapshot.forEach((doc) => {
      const establishment = doc.data().establishmentName || "Unknown";
      labels.push(establishment);
      const totalScans = doc.data().totalScans || 0; // Retrieve totalScans field
      data.push(totalScans); // Add the totalScans to data array
    });


    // Update the chart with the fetched data
    touristSpotsChart.data.labels = labels;
    touristSpotsChart.data.datasets[0].data = data;
    touristSpotsChart.update(); // Refresh the chart
  } catch (error) {
    console.error("Error fetching tourist spot data:", error);
  }
}



// Fetch the tourist spot data when the page loads
fetchTouristSpotData();



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


