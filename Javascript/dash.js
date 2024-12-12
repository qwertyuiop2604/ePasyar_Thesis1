import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-app.js";
import {
  doc,
  getFirestore,
  collection,
  getDocs,
  getDoc,
  updateDoc,
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


let rewards = document.getElementById("reward");
rewards.addEventListener("click", () => {
  window.location = "redeem.html";
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




// Set the default selection to "Monthly" on page load
document.addEventListener("DOMContentLoaded", () => {
  // Set the initial chart type to "Monthly" and update the chart
  updateChartData("Monthly");
  const selectedOption = document.getElementById("selectedOption");
  selectedOption.textContent = "";  // Ensure the span shows "Monthly" initially
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
        label: "Local Tourists",
        data: [], // Data for local tourists
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderWidth: 2,
      },
      {
        label: "Foreign Tourists",
        data: [], // Data for foreign tourists
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
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


// Function to update the chart based on the selected type
async function updateChartData(type) {
  try {
    let reportsRef;
    const localData = [];
    const foreignData = [];
    const labels = [];


    // Set the reports reference and labels depending on the type
    if (type === "Daily") {
      reportsRef = collection(db, "tourist_arrival_reports", "daily", "daily_reports");
      for (let day = 1; day <= 31; day++) {
        labels.push(day.toString());
        localData.push(0);
        foreignData.push(0);
      }
    } else if (type === "Monthly") {
      reportsRef = collection(db, "tourist_arrival_reports", "monthly", "monthly_reports");
      labels.push("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");
      for (let i = 0; i < 12; i++) {
        localData.push(0);
        foreignData.push(0);
      }
    } else if (type === "Yearly") {
      reportsRef = collection(db, "tourist_arrival_reports", "yearly", "yearly_reports");
      const currentYear = new Date().getFullYear();
      for (let year = currentYear - 4; year <= currentYear; year++) {
        labels.push(year.toString());
        localData.push(0);
        foreignData.push(0);
      }
    } else {
      console.error("Invalid report type");
      return;
    }


    // Fetch data from Firestore
    const querySnapshot = await getDocs(reportsRef);


    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const id = doc.id;


      if (type === "Daily") {
        const day = parseInt(id.split("-")[2], 10);
        if (day >= 1 && day <= 31) {
          localData[day - 1] = data.localTourists || 0;
          foreignData[day - 1] = data.foreignTourists || 0;
        }
      } else if (type === "Monthly") {
        const month = parseInt(id.split("-")[1], 10) - 1;
        if (month >= 0 && month <= 11) {
          localData[month] = data.localTourists || 0;
          foreignData[month] = data.foreignTourists || 0;
        }
      } else if (type === "Yearly") {
        const yearIndex = labels.indexOf(id);
        if (yearIndex !== -1) {
          localData[yearIndex] = data.localTourists || 0;
          foreignData[yearIndex] = data.foreignTourists || 0;
        }
      }
    });


    // Update chart data and labels
    mostVisitedChart.data.labels = labels;
    mostVisitedChart.data.datasets[0].data = localData;
    mostVisitedChart.data.datasets[1].data = foreignData;
    mostVisitedChart.update();
  } catch (error) {
    console.error("Error fetching visitor data:", error);
  }
}


window.onload = function() {
  const dropdownLinks = document.querySelectorAll('.dropdown-menu a');
 
  dropdownLinks.forEach(link => {
    link.addEventListener('click', function(event) {
      event.preventDefault(); // Prevent default link behavior
      const selectedType = this.getAttribute('data-type'); // Get the data-type attribute
      handleDropdownClick(event, selectedType); // Call your function
    });
  });
};




function handleDropdownClick(event, selectedType) {
  event.preventDefault(); // Prevent default link behavior

  // Get the span where the selected option will be updated
  const selectedOption = document.getElementById("selectedOption");

  if (selectedOption) {
      // Update the span text to reflect the selected option
      selectedOption.textContent = selectedType;

      // Debugging log to check if the text content is correctly updated
      console.log("Updated Span Text:", selectedOption.textContent);

      // Call the chart update function with the selected type
      updateChartData(selectedType);
  } else {
      console.error("The 'selectedOption' element was not found.");
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

document.getElementById("generatePDF").addEventListener("click", async function () {
  const { jsPDF } = window.jspdf;

  const loadingModal = document.getElementById("loadingModalPdf");
  loadingModal.style.display = "flex"; // Show the modal

  const currentYear = new Date().getFullYear();
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const months = Array.from({ length: 12 }, (_, i) => {
    const month = String(i + 1).padStart(2, "0");
    return { formatted: `${currentYear}-${month}`, name: monthNames[i] };
  });

  const rows = [];
  let totalLocal = 0, totalForeign = 0, totalOverall = 0;

  for (const { formatted, name } of months) {
    try {
      const monthDocRef = doc(
        db,
        "tourist_arrival_reports",
        "monthly",
        "monthly_reports",
        formatted
      );
      const docSnap = await getDoc(monthDocRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const local = data.localTourists || 0;
        const foreign = data.foreignTourists || 0;
        const total = data.totalTourists || 0;

        rows.push([name, local, foreign, total]);
        totalLocal += local;
        totalForeign += foreign;
        totalOverall += total;
      } else {
        rows.push([name, 0, 0, 0]);
      }
    } catch (error) {
      rows.push([name, 0, 0, 0]);
    }
  }

  // Add the Grand Total row with computed values
  rows.push(["Grand Total", totalLocal, totalForeign, totalOverall]);

  const pdfDoc = new jsPDF();

  // Add header images
  const logoPath = "/image/logo-vigan-removebg-preview.png";
  const logoWidth = 30;
  const logoHeight = 30;
  pdfDoc.addImage(logoPath, "PNG", 10, 10, logoWidth, logoHeight);

  const pabLogoPath = "/image/pab_logo.png";
  const pabLogoWidth = 30;
  const pabLogoHeight = 30;
  pdfDoc.addImage(pabLogoPath, "PNG", pdfDoc.internal.pageSize.width - pabLogoWidth - 10, 10, pabLogoWidth, pabLogoHeight);

  // Add header text
  pdfDoc.setFontSize(12);
  pdfDoc.setFont("helvetica", "normal");
  pdfDoc.text("Republic of the Philippines", 45, 15);
  pdfDoc.text("Province of Ilocos Sur", 45, 20);
  pdfDoc.text("City of Vigan", 45, 25);

  pdfDoc.setFont("helvetica", "bold");
  const officeText = "OFFICE OF THE CITY CULTURAL AFFAIRS AND TOURISM";
  const officeTextWidth = pdfDoc.getTextWidth(officeText);
  const officeTextX = (pdfDoc.internal.pageSize.width - officeTextWidth) / 2;
  pdfDoc.text(officeText, officeTextX, 35);

  // Add title with underline
  const pageWidth = pdfDoc.internal.pageSize.width;
  const title = `${currentYear} VIGAN CITY TOURIST ARRIVALS`;
  const titleX = (pageWidth - pdfDoc.getTextWidth(title)) / 2;
  pdfDoc.text(title, titleX, 40);
  pdfDoc.line(titleX, 42, titleX + pdfDoc.getTextWidth(title), 42);

  // Add table with custom styles
  pdfDoc.autoTable({
    head: [["Month", "Local Tourists", "Foreign Tourists", "Total"]],
    body: rows,
    startY: 50,
    theme: "striped",
    styles: { 
      font: "helvetica", 
      fontSize: 10, 
      halign: "center", // Horizontal alignment
      valign: "middle", // Vertical alignment
    },
    headStyles: { 
      fillColor: [100, 149, 237], 
      textColor: 255,
      halign: "center", // Center header text
      valign: "middle", // Center vertically
    },
    bodyStyles: {
      halign: "center", // Center body text
      valign: "middle", // Center vertically
      cellPadding: 3,
    },
    columnStyles: {
      0: { cellWidth: 50, halign: "center", valign: "middle" }, // Month column
      1: { cellWidth: 45, halign: "center", valign: "middle" }, // Local Tourists column
      2: { cellWidth: 45, halign: "center", valign: "middle" }, // Foreign Tourists column
      3: { cellWidth: 45, halign: "center", valign: "middle" }  // Total column
    },
    willDrawCell: function (data) {
      if (data.row.index === rows.length - 1) { // Grand Total row
        pdfDoc.setFont("helvetica", "bold");
        pdfDoc.setFillColor(255, 255, 0); // Yellow background
        pdfDoc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height, 'F');
      }
    }
  });
  
  

  // Add footer logo and text
  const footerLogoPath = "/image/footerlogo.png";
  const footerLogoWidth = 150;
  const footerLogoHeight = 30;


  const footerLogoX = (pdfDoc.internal.pageSize.width - footerLogoWidth) / 2;
  const footerLogoY = pdfDoc.internal.pageSize.height - footerLogoHeight - 20;


  pdfDoc.addImage(footerLogoPath, "PNG", footerLogoX, footerLogoY, footerLogoWidth, footerLogoHeight);


  const footerText = "Vigan City Hall, Burgos St. corner Quezon Avenue, Vigan City 2700, Philippines • Telephone No. (077) 722-2466 • Fax No. (077) 722-3838 • admin@vigancity.gov.ph";
  const footerText2 = "Fax No. (077) 722-3838 • admin@vigancity.gov.ph";


  pdfDoc.setFontSize(9);
  pdfDoc.setFont("arial");


  const footerTextX = footerLogoX;
  const footerTextMaxWidth = footerLogoWidth;


  const splitText1 = pdfDoc.splitTextToSize(footerText, footerTextMaxWidth);
  const footerTextHeight1 = splitText1.length * 8;
  const footerTextY1 = footerLogoY + footerLogoHeight + 5;


  splitText1.forEach((line, index) => {
    const textWidth = pdfDoc.getTextWidth(line);
    const lineX = footerTextX + (footerTextMaxWidth - textWidth) / 2;
    pdfDoc.text(line, lineX, footerTextY1 + index * 8);
  });


  const splitText2 = pdfDoc.splitTextToSize(footerText2, footerTextMaxWidth);
  const footerTextY2 = footerTextY1 + footerTextHeight1 + 3;


  splitText2.forEach((line, index) => {
    const textWidth = pdfDoc.getTextWidth(line);
    const lineX = footerTextX + (footerTextMaxWidth - textWidth) / 2;
    pdfDoc.text(line, lineX, footerTextY2 + index * 8);
  });


  pdfDoc.save("Tourist_Arrival_Report.pdf");
  loadingModal.style.display = "none";
});











// Firestore references


const eventsRef = collection(db, "festivals");
const establishmentsRef = collection(db, "vigan_establishments");


// // Counters


// let localTourist = 0;
// let foreignTourist = 0;
// let totalTourist = 0;
// let userCount = 0;





// // Update functions


// const updatelocalTouristtElement = (count) => {
//   const localTouristElement = document.getElementById("localTourist");
//   if (localTouristtElement) {
//     localTouristCountElement.textContent = `${count}`;
//   }
// };


// const updateforeignTouristElement = (count) => {
//   const foreignTouristElement = document.getElementById("foreignTourist");
//   if (foreignTouristElement) {
//     foreignTouristElement.textContent = `${count}`;
//   }
// };


// const updatetotalTouristElement = (count) => {
//   const totalTouristtElement = document.getElementById("totalTourist");
//   if (totalTouristElement) {
//     totalTouristElement.textContent = `${count}`;
//   }
// };


// const updateuserCountElement = (count) => {
//   const userCountElement = document.getElementById("userCount");
//   if (userCountElement) {
//     userCountElement.textContent = `${count}`;
//   }
// };


// // Snapshot handlers
// const handleEstablishmentsSnapshot = (snapshot, Category, updateFunction) => {
//   const filteredDocs = snapshot.docs.filter(doc => doc.data().Category === Category);
//   const count = filteredDocs.length;
//   updateFunction(count);
// };


// // Specific handlers for each category
// const handleHotelsSnapshot = (snapshot) => {
//   handleEstablishmentsSnapshot(snapshot, "Hotel", updateHotelCountElement);
// };


// const handleTouristSnapshot = (snapshot) => {
//   handleEstablishmentsSnapshot(snapshot, "Tourist Spot", updateTouristCountElement);
// };


// const handleRestoSnapshot = (snapshot) => {
//   handleEstablishmentsSnapshot(snapshot, "Restaurant", updateRestoCountElement);
// };


// const handleSouvenirSnapshot = (snapshot) => {
//   handleEstablishmentsSnapshot(snapshot, "Souvenir Shop", updateSouvenirCountElement);
// };


// const handleEventsSnapshot = (snapshot) => {
//   eventsCount = snapshot.docs.length;
//   updateEventsCountElement(eventsCount);
// };


// onSnapshot(eventsRef, handleEventsSnapshot, (error) => {
//   console.error("Error fetching events:", error);
// });


// onSnapshot(establishmentsRef, (snapshot) => {
//   handleHotelsSnapshot(snapshot);
//   handleTouristSnapshot(snapshot);
//   handleRestoSnapshot(snapshot);
//   handleSouvenirSnapshot(snapshot);
// }, (error) => {
//   console.error("Error fetching establishments:", error);
// });




window.addEventListener("DOMContentLoaded", (event) => {
  // Now the DOM is fully loaded and we can safely access the canvas
  const touristSpotsChartCanvas = document.getElementById("touristSpotsChart");
  const chartContainer = document.getElementById("chart-container");
  const touristCtx = touristSpotsChartCanvas.getContext("2d");


  // Create the bar chart for tourist spots
  const touristSpotsChart = new Chart(touristCtx, {
    type: "line",
    data: {
      labels: [],
      datasets: [
        {
          label: "Local Tourists",
          data: [],
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 2,
        },
        {
          label: "Foreign Tourists",
          data: [],
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          borderColor: "rgba(255, 99, 132, 1)",
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


  // Month mapping to Firestore format
  const monthMap = {
    January: "01",
    February: "02",
    March: "03",
    April: "04",
    May: "05",
    June: "06",
    July: "07",
    August: "08",
    September: "09",
    October: "10",
    November: "11",
    December: "12",
  };


  // Automatically fetch data for the current month
  (async function fetchCurrentMonthData() {
    const currentDate = new Date();
    const currentMonth = String(currentDate.getMonth() + 1).padStart(2, "0"); // Current month in "MM" format
    await fetchTouristSpotData(currentMonth); // Fetch data for the current month
  })();


  // Add click event listener to dropdown items
  document.querySelectorAll("#menuContent a").forEach((item) => {
    item.addEventListener("click", async (event) => {
      event.preventDefault(); // Prevent default link behavior
      const selectedMonth = event.target.getAttribute("data-type"); // Get the month from data-type
      const monthNumber = monthMap[selectedMonth]; // Map to Firestore format
      await fetchTouristSpotData(monthNumber); // Fetch and update chart data
    });
  });


  // Function to fetch tourist spot data from Firestore
  async function fetchTouristSpotData(month) {
    try {
      // Reference the tourist spots collection
      const monthlyRef = collection(db, `total_scans/touristScans/touristspot_scans`);
      const querySnapshot = await getDocs(monthlyRef);


       // Log the number of documents retrieved
    console.log(`Number of document IDs retrieved: ${querySnapshot.size}`);


    // Debug: Log the IDs of all documents retrieved in the querySnapshot
    querySnapshot.docs.forEach(doc => {
      console.log(`Document ID: ${doc.id}`);
    });


      // Initialize arrays to hold chart data
      const labels = [];
      const localData = [];
      const foreignData = [];


      const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));


      const promises = querySnapshot.docs.map(async (docSnapshot, index) => {
        try {
          await delay(index * 100); // Delay between requests to avoid overloading
          const monthlyCollectionRef = collection(docSnapshot.ref, "monthly");
          const monthlyDocRef = doc(monthlyCollectionRef, `2024-${month}`);
         
          console.log(`Fetching data for ${docSnapshot.id} from ${monthlyDocRef.path}`); // Log the path of the document being fetched
         
          const timeDoc = await getDoc(monthlyDocRef);
          if (timeDoc.exists()) {
            const data = timeDoc.data();
            const establishment = data.establishmentName || "Unknown";
            console.log(`Document: ${docSnapshot.id}, Establishment: ${establishment}, Local Tourists: ${data.localTourists}, Foreign Tourists: ${data.foreignTourists}`);
            labels.push(establishment);
            localData.push(data.localTourists || 0);
            foreignData.push(data.foreignTourists || 0);
          } else {
            console.log(`No data found for ${docSnapshot.id}`);
          }
        } catch (error) {
          console.error(`Error fetching data for document ${docSnapshot.id}:`, error);
        }
      });


      // Wait for all data to be fetched
      await Promise.all(promises);
      console.log(`Number of labels added to chart: ${labels.length}`);
     
      // Update chart data
      touristSpotsChart.data.labels = labels;
      touristSpotsChart.data.datasets[0].data = localData;
      touristSpotsChart.data.datasets[1].data = foreignData;
      touristSpotsChart.update();
     
    } catch (error) {
      console.error("Error fetching tourist spot data:", error);
    }
  }
});




window.onload = function () {
  const monthDropdownLinks = document.querySelectorAll('.dropdown-menu a');
 
  // Set default selected option to the current month
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString('default', { month: 'long' }); // Get current month name
  updateSelectedMonthText(currentMonth); // Update the dropdown button text to the current month
 
  monthDropdownLinks.forEach(link => {
    link.addEventListener('click', function (event) {
      event.preventDefault(); // Prevent default link behavior
      const selectedMonth = this.getAttribute('data-type'); // Get the data-type attribute
      handleMonthDropdownClick(event, selectedMonth); // Call your function for months
    });
  });
};


function handleMonthDropdownClick(event, selectedMonth) {
  console.log("Handling month selection for: " + selectedMonth); // Debug log
  // Fetch data for the selected month
  const monthNumber = monthMap[selectedMonth]; // Map to Firestore format
  fetchTouristSpotData(monthNumber); // Fetch and update chart data
  updateSelectedMonthText(selectedMonth); // Update the displayed selected month in the button
}


function updateSelectedMonthText(selectedMonth) {
  const selectedMonthSpan = document.getElementById('selectedMonth'); // Get the span element
  if (selectedMonthSpan) {
    selectedMonthSpan.textContent = selectedMonth; // Update the text content with the selected month
  }
}


document.getElementById("generatePDFScan").addEventListener("click", async function () {
  const { jsPDF } = window.jspdf; // Load jsPDF
  const doc = new jsPDF();


  const loadingModal = document.getElementById("loadingModalPdf");
  loadingModal.style.display = "flex"; // Show the modal


  // Title
  doc.text("Tourist Arrivals Report", 105, 10, { align: "center" });


  // Table headers (Dynamic Months from January to December)
  const months = [
      "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
  ];


  // Fetch all tourist spots from 'total_scans' -> 'touristScans' -> 'touristspot_scans'
  const totalScansRef = collection(db, "total_scans", "touristScans", "touristspot_scans");


  try {
    // Get all spot documents in parallel
    const spotSnapshot = await getDocs(totalScansRef);


    let startY = 20; // Start Y position for the first table


    // Create an array of promises to fetch the monthly data for each tourist spot
    const spotPromises = spotSnapshot.docs.map(async (spotDoc) => {
        const spotId = spotDoc.id; // Get the spot ID dynamically
        const monthlyRef = collection(db, "total_scans", "touristScans", "touristspot_scans", spotId, "monthly");


        // Fetch the monthly data for this spot in parallel
        const querySnapshot = await getDocs(monthlyRef);
        const establishmentName = querySnapshot.empty ? "Unknown" : querySnapshot.docs[0].data().establishmentName;


        // Dynamically set the header to include the establishment name
        const headers = [
            [
                { content: "Month", rowSpan: 2 },
                { content: establishmentName, colSpan: 3 }
            ],
            ["Domestic", "Foreign", "Total"]
        ];


        // Initialize the data array for this spot
        const data = [];
        let grandTotalDomestic = 0; // To track the total of domestic tourists
        let grandTotalForeign = 0;  // To track the total of foreign tourists
        let grandTotal = 0;         // To track the total of all tourists


        // For each month document (YYYY-MM format)
        months.forEach((month, index) => {
            const yearMonth = `2024-${(index + 1).toString().padStart(2, '0')}`; // Format to "2024-01", "2024-02", ...
            const monthData = querySnapshot.docs.find(doc => doc.id === yearMonth);
            let localTourists = 0;
            let foreignTourists = 0;
            if (monthData) {
                localTourists = monthData.data().localTourists || 0;
                foreignTourists = monthData.data().foreignTourists || 0;
            }
            const totalTourists = localTourists + foreignTourists;


            // Add the data for this month
            data.push([month, localTourists, foreignTourists, totalTourists]);


            // Update the grand totals
            grandTotalDomestic += localTourists;
            grandTotalForeign += foreignTourists;
            grandTotal += totalTourists;
        });


        // Add the GRAND TOTAL row
        data.push(["GRAND TOTAL", grandTotalDomestic, grandTotalForeign, grandTotal]);


        // Generate the table for the current spot
        doc.autoTable({
            head: headers,
            body: data,
            startY: startY,
            theme: "grid",
            styles: { halign: "center" },
            headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0] }
        });


        // Update startY for the next table
        startY = doc.lastAutoTable.finalY + 10; // Add space between tables
    });


    // Wait for all spot data to be fetched before saving the PDF
    await Promise.all(spotPromises);


    // Save the PDF
    doc.save("TouristArrivalsReport.pdf");
    loadingModal.style.display = "none";
  } catch (error) {
    console.error("Error generating the PDF: ", error);
    loadingModal.style.display = "none";
  }
});

let slideIndex = 0;

// Function to show the slides
function showSlides() {
  const slides = document.getElementsByClassName("slide");
  for (let i = 0; i < slides.length; i++) {
    slides[i].style.display = "none"; // Hide all slides
  }
  slideIndex++;
  if (slideIndex > slides.length) {
    slideIndex = 1; // Reset to the first slide
  }
  slides[slideIndex - 1].style.display = "block"; // Show the current slide
}

// Function to control the next and previous slides
function plusSlides(n) {
  slideIndex += n;
  const slides = document.getElementsByClassName("slide");
  if (slideIndex > slides.length) {
    slideIndex = 1;
  } else if (slideIndex < 1) {
    slideIndex = slides.length;
  }
  showSlides();
}

// Initial call to show the first slide
showSlides();

// Set interval to automatically change the slide every 5 seconds
setInterval(showSlides, 5000);


// Get elements

let logout = document.getElementById("logout");  // Make sure this is the correct element
let modal = document.getElementById("logoutModal");
let closeBtn = document.getElementsByClassName("close")[0];
let confirmBtn = document.getElementById("confirmLogout");
let cancelBtn = document.getElementById("cancelLogout");


// Open the modal when the logout link is clicked
logout.addEventListener("click", (event) => {
  event.preventDefault();  // Prevent default behavior of the link
  modal.style.display = "block";  // Show the modal
});


// Close the modal when the close button is clicked
closeBtn.onclick = function() {
  modal.style.display = "none";  // Hide the modal
};


// Close the modal when the cancel button is clicked
cancelBtn.onclick = function() {
  modal.style.display = "none";  // Hide the modal
};


// Redirect to "index.html" when the user confirms the logout
confirmBtn.onclick = function() {
  window.location = "index.html";  // Redirect to index.html on confirmation
};


// Close the modal if the user clicks outside of it
window.onclick = function(event) {
  if (event.target === modal) {
    modal.style.display = "none";  // Hide the modal when clicking outside
  }
};













