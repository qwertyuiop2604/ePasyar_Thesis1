// Initialize Firebase and Firestore
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-app.js";
import { getFirestore, addDoc, collection, getDocs, updateDoc, doc } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-storage.js";


const firebaseConfig = {
  apiKey: "AIzaSyA6U1In2wlItYioP3yl43C3hCgiXUZ4oKI",
  authDomain: "epasyar-aa569.firebaseapp.com",
  databaseURL: "https://epasyar-aa569-default-rtdb.firebaseio.com",
  projectId: "epasyar-aa569",
  storageBucket: "epasyar-aa569.appspot.com",
  messagingSenderId: "1004550371893",
  appId: "1:1004550371893:web:692e667675470640980f7c"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

document.addEventListener("DOMContentLoaded", async () => {
  let dash = document.getElementById("dash");
  let profile = document.getElementById("profile");
  let promotion = document.getElementById("promotion");
  let tourist = document.getElementById("tourist");
  let souvenir = document.getElementById("souvenir");
  let restaurant = document.getElementById("restaurant");


  if (dash)
    dash.addEventListener("click", () => (window.location = "dash.html"));
  if (profile)
    profile.addEventListener("click", () => (window.location = "profile.html"));
  if (promotion)
    promotion.addEventListener(
      "click",
      () => (window.location = "promotion.html")
    );
  if (events)
    tourist.addEventListener("click", () => (window.location = "tourist.html"));
  if (souvenir)
    souvenir.addEventListener(
      "click",
      () => (window.location = "souvenir.html")
    );
  if (restaurant)
    restaurant.addEventListener(
      "click",
      () => (window.location = "restaurants.html")
    );
 
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
  let rewards = document.getElementById("reward");
  rewards.addEventListener("click", () => {
    window.location = "redeem.html";
  });

});



// CREATE FORM POPUP
const createAcc = document.getElementById('user-create');
const openPop = document.querySelector('.add_acc');
const closePop = document.querySelector('.close-modal');

// For CREATE FORM POPUP
openPop.addEventListener('click', () => {
  createAcc.style.display = 'block';
  toggleBlur(true); // Apply blur effect
});

closePop.addEventListener('click', () => {
  createAcc.style.display = 'none';
  toggleBlur(false); // Remove blur effect
});


// FOR REGISTER FORM - ADD TO FIREBASE

const formCreate = document.getElementById('create-form');
const name = document.getElementById('name');
const date = document.getElementById('caldate');
const description = document.getElementById('description');
const photos = document.getElementById('photos');


formCreate.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (validateInputs([ name,date,description, photos])) {
    try {
      const photoFile = photos.files[0];
      const photoRef = ref(storage, `photos/${photoFile.name}`);
      await uploadBytes(photoRef, photoFile);
      const photoURL = await getDownloadURL(photoRef);

      await addDoc(collection(db, "festivals"), {
        Name: name.value,
        Date: date.value,
        Description: description.value,
        PhotoURL: photoURL,
        Status: "not done"
      });
      createAcc.style.display = 'none';
      window.location.reload(); // Reload to refresh the table
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  }
});


function validateInputs(inputs) {
  return inputs.every(input => {
    if (input.value.trim() === "") {
      input.classList.add("invalid-input");
      return false;
    } else {
      input.classList.remove("invalid-input");
      return true;
    }
  });
}





// EDIT FORM POPUP
const editAcc = document.getElementById('user-edit');
const oPop = document.querySelector('.edit_acc');
const cPop = document.querySelector('.close-modal-edit');

// For EDIT FORM POPUP
oPop.addEventListener('click', () => {
  editAcc.style.display = 'block';
  toggleBlur(true); // Apply blur effect
});

cPop.addEventListener('click', () => {
  editAcc.style.display = 'none';
  toggleBlur(false); // Remove blur effect
});

// FOR EDIT FORM - UPDATE TO FIREBASE
const formEdit = document.getElementById('edit-form');
const name1 = document.getElementById('name1');
const date1 = document.getElementById('date1');
const description1 = document.getElementById('description1');
const photos1 = document.getElementById('photos1');

formEdit.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (validateInputs([name1, date1,description1, photos1])) {
    try {
      const userID = localStorage.getItem("ID");
      const photoFile = photos1.files[0];
      let photoURL;
      if (photoFile) {
        const photoRef = ref(storage, `photos/${photoFile.name}`);
        await uploadBytes(photoRef, photoFile);
        photoURL = await getDownloadURL(photoRef);
      }

      const updateData = {
       
        Name: name1.value,
        Date: date1.value,
        Description: description1.value,
        
        
      };

      if (photoFile) {
        updateData.PhotoURL = photoURL;
      }

      await updateDoc(doc(db, "festivals", userID), updateData);
      editAcc.style.display = "none"; // Close the edit form
      window.location.reload(); // Reload to refresh the table
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  }
  
});

// Function to limit the description to 1000 words
function limitWords(textareaId, maxWords) {
  const textarea = document.getElementById(textareaId);
  const wordCountMessage = document.createElement('div');
  wordCountMessage.style.color = 'yellow';
  textarea.parentNode.insertBefore(wordCountMessage, textarea.nextSibling);

  textarea.addEventListener('input', function () {
    let words = textarea.value.split(/\s+/).filter(word => word.length > 0);
    if (words.length > maxWords) {
      textarea.value = words.slice(0, maxWords).join(' ');
      words = words.slice(0, maxWords);
    }
    wordCountMessage.textContent = `Word Count: ${words.length}/${maxWords}`;
  });
}

// Apply the word limit to both add and edit forms
limitWords('description', 100);
limitWords('description1', 100);

// Function to display events with a single photo in the table
async function displayEvents() {
  const querySnapshot = await getDocs(collection(db, "festivals"));
  const tbody = document.getElementById('tbody1');
  tbody.innerHTML = '';
  querySnapshot.forEach(doc => {
    if (doc.data().Status === "not done") {
      const trow = document.createElement('tr');
      trow.innerHTML = `
        <td>${doc.data().Name}</td>
        <td>${doc.data().Date}</td>
        <td>${doc.data().Description}</td>
        <td><img src="${doc.data().PhotoURL}" alt="Event Photo" width="150" height="150"></td>   
      `;
      tbody.appendChild(trow);

      // Add event listener for each row to edit event data
      trow.addEventListener('click', () => {
        localStorage.setItem('ID', doc.id);
        document.getElementById('name1').value = doc.data().Name;
        document.getElementById('date1').value = doc.data().Date; // Correcting the assignment here
        document.getElementById('description1').value = doc.data().Description; // Correcting the assignment here
        
        // Optionally highlight the selected row
        highlightRow(trow);
      });
    }
  });
}


// Function to fetch and sort events
async function fetchAndSortEvents() {
  const querySnapshot = await getDocs(collection(db, "festivals"));
  const events = [];

  querySnapshot.forEach(doc => {
    const data = doc.data();
    events.push({
      id: doc.id,
      ...data
    });
  });

  // Sort events by date in ascending order
  events.sort((a, b) => new Date(a.Date) - new Date(b.Date));

  return events;
}
function toggleBlur(shouldBlur) {
  const container = document.querySelector('.main-container'); // Select the common container
  if (shouldBlur) {
    container.classList.add('blur-background');
  } else {
    container.classList.remove('blur-background');
  }
}




// Function to populate table with sorted events
const tbody = document.getElementById('tbody1');
  const monthNames = [
    "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY",
    "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
  ];
  async function populateTable(events) {
    if (!events) {
      events = await fetchAndSortEvents();
    }
  
    tbody.innerHTML = ''; // Clear existing table rows
  
    events.forEach(event => {
      if (event.Status === "not done" && event.Date) {  // Check if Date is defined
        const dateParts = event.Date.split("-");
        const monthWord = monthNames[parseInt(dateParts[1], 10) - 1]; // Convert month number to word
        const formattedDate = `${monthWord} ${dateParts[2]}, ${dateParts[0]}`;
  
        const trow = document.createElement('tr');
        trow.innerHTML = `
          <td>${event.Name}</td>
         
          <td><button class="see-details-btn" id="details_${event.id}">Show Details</button></td>
        `;
        tbody.appendChild(trow);
  
        trow.addEventListener('click', () => {
          localStorage.setItem('ID', event.id);
          document.getElementById('name1').value = event.Name;
          document.getElementById('date1').value = event.Date;
          document.getElementById('description1').value = event.Description;
          highlightRow(trow);
        
        // Add event listener for "See Details" button
document.getElementById(`details_${event.id}`).addEventListener('click', (e) => {
  e.stopPropagation();  // Prevent row click from triggering
  showDetailsModal(event);  // Pass event data to the modal function
});
      });
    }
  });
}
const detailsBtn = document.getElementById(`details_${doc.id}`);
if (detailsBtn) {
    detailsBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showDetailsModal(doc.data());
    });
}


function showDetailsModal(data) {
  document.getElementById("details-name").textContent = data.Name; 
  document.getElementById("details-date").textContent = data.Date;
  document.getElementById("details-description").textContent = data.Description;

  document.getElementById("details-photo").src = data.PhotoURL || "default_image_url_here"; // Add a default image URL if PhotoURL is not available

  const modal = document.getElementById("details-modal");
  modal.style.display = "block";

  // Add blur effect to .main-container
  toggledBlur(true);

  const closeBtn = modal.querySelector(".details-close");
  closeBtn.onclick = () => {
    modal.style.display = "none";
    toggledBlur(false); // Remove blur effect when closing modal
  };

  // Close modal when clicking outside of it
  window.onclick = function (event) {
    if (event.target === modal) {
      modal.style.display = "none";
      toggledBlur(false); // Remove blur effect when clicking outside of the modal
    }
  };
}

function toggledBlur(shouldBlur) {
  const container = document.querySelector('.main-container'); // Select the container that holds your page content
  if (shouldBlur) {
    container.classList.add('blur-background');
  } else {
    container.classList.remove('blur-background');
  }
}



// Calendar functionality
const calDate = document.getElementById('cal-date');

calDate.addEventListener('change', async () => {
  const selectedDate = calDate.value;
  const querySnapshot = await getDocs(collection(db, "festivals"));
  const filteredEvents = [];

  querySnapshot.forEach(doc => {
    if (doc.data().Date === selectedDate && doc.data().Status === "not done") {
      filteredEvents.push({
        id: doc.id,
        ...doc.data()
      });
    }
  });

  populateTable(filteredEvents);
});


// Auto-archive past and future events
async function autoArchivePastAndFutureEvents() {
  const querySnapshot = await getDocs(collection(db, "festivals"));
  const currentDate = new Date();

  querySnapshot.forEach(async (doc) => {
    const eventDate = new Date(doc.data().Date);
    const status = doc.data().Status;
    
    // Archive past events (eventDate < currentDate) or future events (eventDate > currentDate)
    if ((eventDate < currentDate && status === "not done") || eventDate.getFullYear() > currentDate.getFullYear()) {
      await updateDoc(doc.ref, {
        Status: "archived",
        ArchivedBy: "AUTO_ARCHIVE",
        ArchivedDate: currentDate.toLocaleString()
      });
    }
  });
}

autoArchivePastAndFutureEvents();


// // Archive event
// document.getElementById('delete_acc').addEventListener('click', async () => {
//   const userID = localStorage.getItem("ID");
//   try {
//     await updateDoc(doc(db, "festivals", userID), {
//       Status: "archived",
//       ArchivedBy: "ADMIN", // Replace with the actual admin's name if needed
//       ArchivedDate: new Date().toLocaleString()
//     });
//     localStorage.setItem('lastEventUpdate', Date.now());
//     window.location.reload(); // Reload to refresh the table
//   } catch (error) {
//     console.error("Error updating document: ", error);
//   }
// });

// Initial call to populate table
populateTable();

// Function to highlight the selected row
function highlightRow(row) {
  const rows = document.querySelectorAll('#tbody1 tr');
  rows.forEach(r => r.classList.remove('selected-row'));
  row.classList.add('selected-row');
  document.getElementById("edit_acc").disabled = false;
  document.getElementById("delete_acc").disabled = false;
}

// Set interval to reload events every minute (60000 ms)
setInterval(() => {
  populateTable();
}, 60000);


// Button to see archived accounts
document.getElementById('archived_acc').addEventListener('click', () => {
  window.location = "archives.html";
});
    



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

    document.getElementById("delete_acc").disabled = false;
  };
}
// window.onload = GetAllDataOnce;

document.getElementById('delete_acc').addEventListener('click', () => {
  document.getElementById('delete_acc_modal').style.display = "block";
});

document.getElementById('delete_cancel').addEventListener('click', () => {
  document.getElementById('delete_acc_modal').style.display = "none";
});

const querySnap2 = await getDocs(collection(db, "festivals"));
querySnap2.forEach((doc2) => {
  document.getElementById('delete_confirm').addEventListener('click', (e) => {
    const updateStats = doc(db, "festivals", localStorage.getItem("ID"));
  
    updateDoc(updateStats, {
      Status: "archived",
      ArchivedBy: "ADMIN", // Replace with the actual admin's name if needed
 ArchivedDate: new Date().toLocaleString()
    }).then(() => {
      window.location = "archives.html";
      window.location.reload();
    });
  });
  
});



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
