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


let activities = document.getElementById("activities");

activities.addEventListener("click", () => {
  window.location = "activities.html";
});
let user = document.getElementById("user");

user.addEventListener("click", () => {
  window.location = "user.html";
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

let souvenir = document.getElementById("souvenir");
souvenir.addEventListener("click", () => {
  window.location = "souvenir.html";
});
let souvenirs = document.getElementById("souvenirs");
souvenirs.addEventListener("click", () => {
  window.location = "souvenir.html";
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
        data: [1, 1], // Initial data
        backgroundColor: [
       
          "#337ab7",
          "yellow",
          "green",
          "blue",
          "violet",
          "red",
          "pink",
          "red",
          "orange",
          "yellow",
          "green",
          "blue",
          "violet",
          "red",
          "pink",
        ],
        borderColor: [
          "#337ab7",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 2,
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
    }  else
     if (type === "Monthly") {
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


// Fetch initial chart data for monthly reports by default
updateChartData("Monthly");




// Event listeners for menu options
document.getElementById('menuContent').addEventListener('click', function(event) {
  if (event.target.tagName === 'A') {
    const type = event.target.textContent.trim();
    updateChartData(type);
  }
});



// Fetch initial chart data for monthly reports by default
updateChartData("Monthly");

// Importing libraries
const { jsPDF } = window.jspdf;
const XLSX = window.XLSX;

async function generatePDFReport() {
  const doc = new jsPDF();

  // Header Section
  doc.setFont("times", "bold");
  doc.setFontSize(12);
  doc.text("Republic of the Philippines", 105, 10, { align: "center" });
  doc.text("Province of Ilocos Sur", 105, 16, { align: "center" });
  doc.text("City of Vigan", 105, 22, { align: "center" });
  doc.text("OFFICE OF THE CITY CULTURAL AFFAIRS AND TOURISM", 105, 28, {
    align: "center",
  });

  // Title Section
  doc.setFontSize(16);
  doc.text("2023 VIGAN CITY TOURIST ARRIVALS", 105, 40, { align: "center" });

  // Data Section
  const accommodationHeaders = [["MONTH", "LOCAL", "FOREIGN", "TOTAL"]];
  const dayVisitorHeaders = [["MONTH", "LOCAL", "FOREIGN", "TOTAL"]];

  const accommodationData = [
    ["January", "5,638", "271", "5,909"],
    ["February", "7,348", "971", "8,319"],
    ["March", "3,220", "326", "3,546"],
    ["April", "7,054", "1,414", "8,468"],
    ["May", "6,166", "907", "7,073"],
    ["June", "6,880", "687", "7,567"],
    ["July", "4,106", "193", "4,299"],
    ["August", "2,805", "213", "3,018"],
    ["September", "1,952", "98", "2,050"],
    ["October", "2,681", "191", "2,872"],
    ["November", "4,004", "397", "4,401"],
    ["December", "4,175", "528", "4,703"],
    ["GRAND TOTAL:", "56,029", "6,196", "62,225"],
  ];

  const dayVisitorData = [
    ["January", "41,303", "1,024", "42,327"],
    ["February", "43,150", "1,063", "44,213"],
    ["March", "45,343", "915", "46,258"],
    ["April", "54,623", "639", "55,262"],
    ["May", "57,094", "622", "57,716"],
    ["June", "79,097", "1,107", "80,204"],
    ["July", "68,718", "961", "69,679"],
    ["August", "49,862", "796", "50,658"],
    ["September", "31,260", "630", "31,890"],
    ["October", "46,288", "793", "47,081"],
    ["November", "51,728", "929", "52,657"],
    ["December", "79,497", "1,227", "80,724"],
    ["GRAND TOTAL:", "647,963", "10,706", "658,669"],
  ];

  // Accommodation Table
  doc.autoTable({
    head: accommodationHeaders,
    body: accommodationData,
    startY: 50,
    theme: "grid",
    headStyles: { fillColor: [211, 211, 211] },
    columnStyles: {
      0: { halign: "left" }, // Align "MONTH" column to the left
      1: { halign: "right" },
      2: { halign: "right" },
      3: { halign: "right" },
    },
  });

  // Day Visitor Table
  doc.autoTable({
    head: dayVisitorHeaders,
    body: dayVisitorData,
    startY: doc.lastAutoTable.finalY + 10,
    theme: "grid",
    headStyles: { fillColor: [211, 211, 211] },
    columnStyles: {
      0: { halign: "left" }, // Align "MONTH" column to the left
      1: { halign: "right" },
      2: { halign: "right" },
      3: { halign: "right" },
    },
  });

  // Footer Section
  const footerY = doc.lastAutoTable.finalY + 20;
  doc.setFontSize(12);
  doc.text("Accommodation – 62,225", 20, footerY);
  doc.text("Day Visitor – 658,669", 20, footerY + 6);
  doc.text("Grand Total = 720,894", 20, footerY + 12);

  // Signatures
  const signatureY = footerY + 30;
  doc.text("Prepared by:", 20, signatureY);
  doc.text("Certified Correct by:", 140, signatureY);
  doc.text("CYRILLE PRECIOUS MAE R. CACHOLA", 20, signatureY + 10);
  doc.text("MuTech II", 20, signatureY + 16);
  doc.text("JO-ANNE MARGARITA R. GUTIERREZ", 140, signatureY + 10);
  doc.text("STOO I", 140, signatureY + 16);

  // Save PDF
  doc.save("TouristReport.pdf");
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
  if (type === "Monthly") return collection(db, "tourist_arrival_reports", "monthly", "monthly_reports");
  if (type === "Yearly") return collection(db, "tourist_arrival_reports", "yearly", "yearly_reports");
}

// Helper function to map report type to specific data key
function getDataKey(type) {
  switch (type) {
    case "Daily":
      return "dailyCount";
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

async function generateExcelReport() {
  const workbook = XLSX.utils.book_new();

  // Data for Accommodation
  const accommodationData = [
    ["MONTH", "LOCAL", "FOREIGN", "TOTAL"],
    ["January", "5,638", "271", "5,909"],
    ["February", "7,348", "971", "8,319"],
    ["March", "3,220", "326", "3,546"],
    ["April", "7,054", "1,414", "8,468"],
    ["May", "6,166", "907", "7,073"],
    ["June", "6,880", "687", "7,567"],
    ["July", "4,106", "193", "4,299"],
    ["August", "2,805", "213", "3,018"],
    ["September", "1,952", "98", "2,050"],
    ["October", "2,681", "191", "2,872"],
    ["November", "4,004", "397", "4,401"],
    ["December", "4,175", "528", "4,703"],
    ["GRAND TOTAL:", "56,029", "6,196", "62,225"],
  ];

  // Data for Day Visitors
  const dayVisitorData = [
    ["MONTH", "LOCAL", "FOREIGN", "TOTAL"],
    ["January", "41,303", "1,024", "42,327"],
    ["February", "43,150", "1,063", "44,213"],
    ["March", "45,343", "915", "46,258"],
    ["April", "54,623", "639", "55,262"],
    ["May", "57,094", "622", "57,716"],
    ["June", "79,097", "1,107", "80,204"],
    ["July", "68,718", "961", "69,679"],
    ["August", "49,862", "796", "50,658"],
    ["September", "31,260", "630", "31,890"],
    ["October", "46,288", "793", "47,081"],
    ["November", "51,728", "929", "52,657"],
    ["December", "79,497", "1,227", "80,724"],
    ["GRAND TOTAL:", "647,963", "10,706", "658,669"],
  ];

  // Add Accommodation Data Sheet
  const accommodationSheet = XLSX.utils.aoa_to_sheet(accommodationData);
  XLSX.utils.book_append_sheet(workbook, accommodationSheet, "Accommodation");

  // Add Day Visitor Data Sheet
  const dayVisitorSheet = XLSX.utils.aoa_to_sheet(dayVisitorData);
  XLSX.utils.book_append_sheet(workbook, dayVisitorSheet, "Day Visitors");

  // Add Summary Sheet
  const summaryData = [
    ["Category", "Total"],
    ["Accommodation", "62,225"],
    ["Day Visitor", "658,669"],
    ["Grand Total", "720,894"],
  ];
  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(workbook, summarySheet, "Summary");

  // Save the workbook
  XLSX.writeFile(workbook, "TouristReport.xlsx");
}

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


// Event Listeners for Buttons
document.getElementById("generatePDFScan").addEventListener("click", createPDFReport);
document.getElementById("generateExcelScan").addEventListener("click", createExcelReport);

// Function to Generate PDF Report
async function createPDFReport() {
  const doc = new jsPDF();

  // Header Section
  doc.setFont("times", "bold");
  doc.setFontSize(12);
  doc.text("Republic of the Philippines", 105, 10, { align: "center" });
  doc.text("Province of Ilocos Sur", 105, 16, { align: "center" });
  doc.text("City of Vigan", 105, 22, { align: "center" });
  doc.text("OFFICE OF THE CITY CULTURAL AFFAIRS AND TOURISM", 105, 28, {
    align: "center",
  });

  // Title Section
  doc.setFontSize(16);
  doc.text("2023 VIGAN CITY TOURIST ARRIVALS", 105, 40, { align: "center" });

  // Data Section for Accommodation
  const accommodationHeaders = [["MONTH", "LOCAL", "FOREIGN", "TOTAL"]];
  const accommodationData = [
    ["January", "5,638", "271", "5,909"],
    ["February", "7,348", "971", "8,319"],
    ["March", "3,220", "326", "3,546"],
    ["April", "7,054", "1,414", "8,468"],
    ["May", "6,166", "907", "7,073"],
    ["June", "6,880", "687", "7,567"],
    ["July", "4,106", "193", "4,299"],
    ["August", "2,805", "213", "3,018"],
    ["September", "1,952", "98", "2,050"],
    ["October", "2,681", "191", "2,872"],
    ["November", "4,004", "397", "4,401"],
    ["December", "4,175", "528", "4,703"],
    ["GRAND TOTAL:", "56,029", "6,196", "62,225"],
  ];

  // Data Section for Day Visitors
  const dayVisitorHeaders = [["MONTH", "LOCAL", "FOREIGN", "TOTAL"]];
  const dayVisitorData = [
    ["January", "41,303", "1,024", "42,327"],
    ["February", "43,150", "1,063", "44,213"],
    ["March", "45,343", "915", "46,258"],
    ["April", "54,623", "639", "55,262"],
    ["May", "57,094", "622", "57,716"],
    ["June", "79,097", "1,107", "80,204"],
    ["July", "68,718", "961", "69,679"],
    ["August", "49,862", "796", "50,658"],
    ["September", "31,260", "630", "31,890"],
    ["October", "46,288", "793", "47,081"],
    ["November", "51,728", "929", "52,657"],
    ["December", "79,497", "1,227", "80,724"],
    ["GRAND TOTAL:", "647,963", "10,706", "658,669"],
  ];

  // Generate Accommodation Table
  doc.autoTable({
    head: accommodationHeaders,
    body: accommodationData,
    startY: 50,
    theme: "grid",
    headStyles: { fillColor: [211, 211, 211] },
    columnStyles: {
      0: { halign: "left" },
      1: { halign: "right" },
      2: { halign: "right" },
      3: { halign: "right" },
    },
  });

  // Generate Day Visitors Table
  doc.autoTable({
    head: dayVisitorHeaders,
    body: dayVisitorData,
    startY: doc.lastAutoTable.finalY + 10,
    theme: "grid",
    headStyles: { fillColor: [211, 211, 211] },
    columnStyles: {
      0: { halign: "left" },
      1: { halign: "right" },
      2: { halign: "right" },
      3: { halign: "right" },
    },
  });

  // Footer Section
  const footerY = doc.lastAutoTable.finalY + 20;
  doc.setFontSize(12);
  doc.text("Accommodation – 62,225", 20, footerY);
  doc.text("Day Visitor – 658,669", 20, footerY + 6);
  doc.text("Grand Total = 720,894", 20, footerY + 12);

  // Save the PDF
  doc.save("TouristReport.pdf");
}

// Function to Generate Excel Report
async function createExcelReport() {
  const workbook = XLSX.utils.book_new();

  // Data for Accommodation
  const accommodationData = [
    ["MONTH", "LOCAL", "FOREIGN", "TOTAL"],
    ["January", "5,638", "271", "5,909"],
    ["February", "7,348", "971", "8,319"],
    ["March", "3,220", "326", "3,546"],
    ["April", "7,054", "1,414", "8,468"],
    ["May", "6,166", "907", "7,073"],
    ["June", "6,880", "687", "7,567"],
    ["July", "4,106", "193", "4,299"],
    ["August", "2,805", "213", "3,018"],
    ["September", "1,952", "98", "2,050"],
    ["October", "2,681", "191", "2,872"],
    ["November", "4,004", "397", "4,401"],
    ["December", "4,175", "528", "4,703"],
    ["GRAND TOTAL:", "56,029", "6,196", "62,225"],
  ];

  // Data for Day Visitors
  const dayVisitorData = [
    ["MONTH", "LOCAL", "FOREIGN", "TOTAL"],
    ["January", "41,303", "1,024", "42,327"],
    ["February", "43,150", "1,063", "44,213"],
    ["March", "45,343", "915", "46,258"],
    ["April", "54,623", "639", "55,262"],
    ["May", "57,094", "622", "57,716"],
    ["June", "79,097", "1,107", "80,204"],
    ["July", "68,718", "961", "69,679"],
    ["August", "49,862", "796", "50,658"],
    ["September", "31,260", "630", "31,890"],
    ["October", "46,288", "793", "47,081"],
    ["November", "51,728", "929", "52,657"],
    ["December", "79,497", "1,227", "80,724"],
    ["GRAND TOTAL:", "647,963", "10,706", "658,669"],
  ];

  // Create Sheets
  const accommodationSheet = XLSX.utils.aoa_to_sheet(accommodationData);
  const dayVisitorSheet = XLSX.utils.aoa_to_sheet(dayVisitorData);

  // Add Sheets to Workbook
  XLSX.utils.book_append_sheet(workbook, accommodationSheet, "Accommodation");
  XLSX.utils.book_append_sheet(workbook, dayVisitorSheet, "Day Visitors");

  // Add Summary Sheet
  const summaryData = [
    ["Category", "Total"],
    ["Accommodation", "62,225"],
    ["Day Visitor", "658,669"],
    ["Grand Total", "720,894"],
  ];
  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(workbook, summarySheet, "Summary");

  // Save Workbook
  XLSX.writeFile(workbook, "TouristReport.xlsx");
}

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


