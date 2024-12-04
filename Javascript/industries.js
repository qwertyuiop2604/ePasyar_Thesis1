// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-app.js";
import { getFirestore, addDoc, collection, getDocs, updateDoc, doc } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-storage.js";

// Firebase configuration
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
const storage = getStorage(app);

// Event listeners for navigation buttons
const navButtons = {
  dash: 'dash.html',
  profile: 'profile.html',
  promotion: 'promotion.html',
  tourist: 'tourist.html',
  souvenir: 'souvenir.html',
  restaurant: 'restaurants.html',
  localdishes: 'dishes.html',
  otop: 'otop.html',
  events: 'events.html'
};


let activities = document.getElementById("activities");

activities.addEventListener("click", () => {
  window.location = "activities.html";
});
let user = document.getElementById("user");

user.addEventListener("click", () => {
  window.location = "user.html";
});

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

const description = document.getElementById('description');
const photos = document.getElementById('photos');

formCreate.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (validateInputs([name, description, photos])) {
    try {
      const photoFile = photos.files[0];
      const photoRef = ref(storage, `local_industries/${photoFile.name}`);
      await uploadBytes(photoRef, photoFile);
      const photoURL = await getDownloadURL(photoRef);

      await addDoc(collection(db, "local_industries"), {
        Name: name.value,
        Description: description.value.trim(),
        PhotoURL: photoURL,
       
      });
      toggleDisplay(createAcc, 'none');
      localStorage.setItem('lastEventUpdate', Date.now());
      window.location.reload();
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  }
});

function validateInputs(inputs) {
  let isValid = true;
  inputs.forEach(input => {
    if (input.value.trim() === '') {
      input.classList.add('invalid-input');
      isValid = false;
    } else {
      input.classList.remove('invalid-input');
      input.classList.add('valid-input');
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

const description1 = document.getElementById('description1');
const photos1 = document.getElementById('photos1');

formEdit.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (validateInputs([name1, description1])) {
    try {
      const userID = localStorage.getItem("ID");
      const photoFile = photos1.files[0];
      let photoURL;
      if (photoFile) {
        const photoRef = ref(storage, `local_industries/${photoFile.name}`);
        await uploadBytes(photoRef, photoFile);
        photoURL = await getDownloadURL(photoRef);
      }

      const updateData = {
        Name: name1.value,
    
        Description: description1.value
      };

      if (photoFile) {
        updateData.PhotoURL = photoURL;
      }

      await updateDoc(doc(db, "local_industries", userID), updateData);
      toggleDisplay(editAcc, 'none');
      localStorage.setItem('lastEventUpdate', Date.now());
      window.location.reload(); // Reload to refresh the table
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  }
});

// Populate table with data
const tbody = document.getElementById('tbody1');
const querySnapshot = await getDocs(collection(db, "local_industries"));
querySnapshot.forEach(doc => {
  if (doc.data()) {
    const trow = document.createElement('tr');
    trow.innerHTML = `
      <td>${doc.data().Name}</td>
      <td><button class="see-details-btn" id="details_${doc.id}">See Details</button></td>
    `;
    
    tbody.appendChild(trow);

    // Now, add the event listener to the button
    const detailsBtn = document.getElementById(`details_${doc.id}`);
    if (detailsBtn) {
      detailsBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showDetailsModal(doc.data());
      });
    }

    trow.addEventListener('click', () => {
      localStorage.setItem('ID', doc.id);
      document.getElementById('name1').value = doc.data().Name;
      document.getElementById('description1').value = doc.data().Description;
      highlightRow(trow);
    });
  }
});

const detailsBtn = document.getElementById(`details_${doc.id}`);
if (detailsBtn) {
    detailsBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showDetailsModal(doc.data());
    });
}


function showDetailsModal(data) {
  document.getElementById("details-name").textContent = data.Name; 
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

function toggleBlur(shouldBlur) {
  const container = document.querySelector('.main-container'); // Select the common container
  if (shouldBlur) {
    container.classList.add('blur-background');
  } else {
    container.classList.remove('blur-background');
  }
}

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

function highlightRow(row) {
  const rows = document.querySelectorAll('#tbody1 tr');
  rows.forEach(r => r.classList.remove('selected-row'));
  row.classList.add('selected-row');
  document.getElementById("edit_acc").disabled = false;
  document.getElementById("delete_acc").disabled = false;
}

// Auto-archive past events
async function autoArchivePastEvents() {
  const querySnapshot = await getDocs(collection(db, "local_industries"));
  const currentDate = new Date();

  querySnapshot.forEach(async (doc) => {
    const eventDate = new Date(doc.data().Date);
    if (eventDate < currentDate && doc.data()) {
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
    await updateDoc(doc(db, "local_industries", userID), {
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

// Button to see archived accounts
document.getElementById('archived_acc').addEventListener('click', () => {
  window.location = "iArchives.html";
});

// 
// Storage event listener
window.addEventListener('storage', (event) => {
  if (event.key === 'lastEventUpdate') {
    window.location.reload();
  }
});

function toggleDisplay(element, displayStyle) {
  element.style.display = displayStyle;
}


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
 