import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getFirestore,collection, getDocs, updateDoc, doc, setDoc  } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";



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

let bck = document.getElementById("bckbtn");
bck.addEventListener('click', () => {
    window.location = 'souvenir.html'
})
let rewards = document.getElementById("reward");
rewards.addEventListener("click", () => {
  window.location = "redeem.html";
});
let events = document.getElementById("events");
events.addEventListener('click', () => {
    window.location = 'events.html'
})


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
// FINAL
const archivedTbody = document.getElementById("archived-tbody");

const querySnap = await getDocs(collection(db, "vigan_establishments"));
querySnap.forEach((doc) => {
  if (doc.data().Status === "S Shop Closed") {
    const trow = document.createElement("tr");
    trow.innerHTML = `
      <td>${doc.data().ArchivedBy}</td>
      <td>${doc.data().Name}</td>
      
       <td>${doc.data().Number}</td>
       <td>${doc.data().Location}</td>
        <td><img src="${doc.data().PhotoURL}" alt="Event Photo" width="150" height="150"></td>   
      <td>${doc.data().ArchivedDate}</td>
    `;
    archivedTbody.appendChild(trow);
    trow.addEventListener('click', () => {
      localStorage.setItem('ID', doc.id);
      highlightRow(trow);
    });
  }
});
localStorage.setItem("ID", doc.id);
       //console.log(doc.id)

//HIGHLIGHT TABLE ROW WHEN CLICKED - FINAL
var table = document.getElementById("table");
var rows = document.getElementsByTagName("tr");
for (let i = 1; i < rows.length; i++) {
  var currentRow = table.rows[i];
  currentRow.onclick = function () {
    Array.from(this.parentElement.children).forEach(function (el) {
      el.classList.remove("selected-row");
    });

    // [...this.parentElement.children].forEach((el) => el.classList.remove('selected-row'));
    this.classList.add("selected-row");

    document.getElementById("enabled").disabled = false;
  };
}

 // window.onload = GetAllDataOnce;

document.getElementById('enabled').addEventListener('click', () => {
  document.getElementById('cnfrm_modal_enable').style.display = "block";
});

document.getElementById('cnl').addEventListener('click', () => {
  document.getElementById('cnfrm_modal_enable').style.display = "none";
});

const querySnap2 = await getDocs(collection(db, "vigan_establishments"));
querySnap2.forEach((doc2) => {
  document.getElementById('cnfrm').addEventListener('click', (e) => {
    const updateStats = doc(db, "vigan_establishments", localStorage.getItem("ID"));
  
    updateDoc(updateStats, {
      Status: "S Shop Open",
      ArchivedBy: "",
      ArchivedDate: ""
    }).then(() => {
      window.location = "sArchives.html";
      window.location.reload();
    });
  });
});

function toggleBlur(shouldBlur) {
  const container = document.querySelector('.main-container'); // Select the common container
  if (shouldBlur) {
    container.classList.add('blur-background');
  } else {
    container.classList.remove('blur-background');
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