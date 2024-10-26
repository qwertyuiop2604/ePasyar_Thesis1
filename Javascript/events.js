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

// Event listeners for navigation buttons
const navButtons = {
  dash: 'dash.html',
  profile: 'profile.html',
  promotion: 'promotion.html',
  tourist: 'tourist.html',
  souvenir: 'souvenir.html',
  logout: 'index.html',
  restaurant: 'restaurants.html',
  localdishes: 'dishes.html'
};

let otop = document.getElementById("otop");
otop.addEventListener("click", () => window.location = "otop.html");

let localdishes = document.getElementById("localdishes");
localdishes.addEventListener("click", () => window.location = "dishes.html");

let localindustries = document.getElementById("localindustries");
localindustries.addEventListener("click", () => window.location = "industries.html");



Object.keys(navButtons).forEach(button => {
  document.getElementById(button).addEventListener('click', () => {
    window.location = navButtons[button];
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
const date = document.getElementById('date');
const description = document.getElementById('description');
const photos = document.getElementById('photos');

formCreate.addEventListener('submit', async (e) => {
  e.preventDefault(); // Prevent form from submitting the default way

  // Check if inputs are valid
  if (validateInputs([name, date, description, photos])) {
    try {
      const photoFile = photos.files[0]; // Get the file from the input
      if (photoFile) {
        // Upload photo to Firebase storage
        const photoRef = ref(storage, `photos/${photoFile.name}`);
        await uploadBytes(photoRef, photoFile); // Upload the file
        const photoURL = await getDownloadURL(photoRef); // Get the uploaded photo's URL

        // Add the event to Firestore
        await addDoc(collection(db, "festivals"), {
          Name: name.value,
          Date: date.value,
          Description: description.value.trim(),
          PhotoURL: photoURL, // Add the photo URL
          Status: "not done" // Mark the event as not done
        });

        console.log("Event added successfully!");
        toggleDisplay(createAcc, 'none'); // Hide the form
        localStorage.setItem('lastEventUpdate', Date.now()); // Update local storage
        window.location.reload(); // Reload the page to show the newly added event
      } else {
        console.error("No photo uploaded. Please select a photo.");
      }
    } catch (error) {
      console.error("Error adding document to Firestore: ", error);
    }
  }
});


function validateInputs(inputs) {
  let isValid = true;
  inputs.forEach((input) => {
    if (!input || input.value.trim() === "") {
      input?.classList.add("invalid-input");
      isValid = false;
    } else {
      input.classList.remove("invalid-input");
      input.classList.add("valid-input");
    }
  });
  return isValid;
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

// FOR EDIT FORM - UPDATE TO FIREBASE
formEdit.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (validateInputs([name1, date1, description1, photos1])) {
    try {
      const userID = localStorage.getItem("ID");
      const photoFile = photos1.files[0];
      let photoURL = null;

      if (photoFile) {
        const photoRef = ref(storage, `photos/${photoFile.name}`);
        await uploadBytes(photoRef, photoFile);
        photoURL = await getDownloadURL(photoRef);
      }

      const updateData = {
        Name: name1.value,
        Date: date1.value,
        Description: description1.value
      };

      if (photoURL) {
        updateData.PhotoURL = photoURL;
      }

      await updateDoc(doc(db, "festivals", userID), updateData);
      toggleDisplay(editAcc, 'none');
      localStorage.setItem('lastEventUpdate', Date.now());
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
    if (event.Status === "not done") {
      const dateParts = event.Date.split("-");
      const monthWord = monthNames[parseInt(dateParts[1], 10) - 1]; // Convert month number to word
      const formattedDate = `${monthWord} ${dateParts[2]}, ${dateParts[0]}`;

      const trow = document.createElement('tr');
      trow.innerHTML = `
        <td>${event.Name}</td>
        <td>${formattedDate}</td>
        <td>${event.Description}</td>
        <td><img src="${event.PhotoURL}" alt="Event Photo" width="150" height="150"></td>
      `;
      tbody.appendChild(trow);

      trow.addEventListener('click', () => {
        localStorage.setItem('ID', event.id);
        document.getElementById('name1').value = event.Name;
        document.getElementById('date1').value = event.Date;
        document.getElementById('description1').value = event.Description;
        highlightRow(trow);
      });
    }
  });
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


// Auto-archive past events
async function autoArchivePastEvents() {
  const querySnapshot = await getDocs(collection(db, "festivals"));
  const currentDate = new Date();

  querySnapshot.forEach(async (doc) => {
    const eventDate = new Date(doc.data().Date);
    if (eventDate < currentDate && doc.data().Status === "not done") {
      await updateDoc(doc.ref, {
        Status: "archived",
        ArchivedBy: "AUTO_ARCHIVE",
        ArchivedDate: currentDate.toLocaleString()
      });
    }
  });
}

autoArchivePastEvents();

// Archive event
document.getElementById('delete_acc').addEventListener('click', async () => {
  const userID = localStorage.getItem("ID");
  try {
    await updateDoc(doc(db, "festivals", userID), {
      Status: "archived",
      ArchivedBy: "ADMIN", // Replace with the actual admin's name if needed
      ArchivedDate: new Date().toLocaleString()
    });
    localStorage.setItem('lastEventUpdate', Date.now());
    window.location.reload(); // Reload to refresh the table
  } catch (error) {
    console.error("Error updating document: ", error);
  }
});

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
    
 