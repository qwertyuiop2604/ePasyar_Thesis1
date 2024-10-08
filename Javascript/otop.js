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
  logout: 'index.html',
 
  restaurant: 'restaurants.html',
  localindustries: 'industries.html',
  localdishes: 'dishes.html',
  events: 'events.html'

};
document.addEventListener('DOMContentLoaded', function () {
  var dropdown = document.querySelector('.dropdown-btn');
  var dropdownContent = document.querySelector('.dropdown-container');
  dropdown.addEventListener('click', function () {
    dropdownContent.classList.toggle('show');
  });
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

openPop.addEventListener('click', () => {
  createAcc.style.display = 'block';
});
closePop.addEventListener('click', () => {
  createAcc.style.display = 'none';
});

// FOR REGISTER FORM - ADD TO FIREBASE
const formCreate = document.getElementById('create-form');
const name = document.getElementById('name');
const description = document.getElementById('description');
const place = document.getElementById('place');
const photos = document.getElementById('photos');

formCreate.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (validateInputs([name, description, place, photos])) {
    try {
      const photoFile = photos.files[0];
      const photoRef = ref(storage, `otop/${photoFile.name}`);
      await uploadBytes(photoRef, photoFile);
      const photoURL = await getDownloadURL(photoRef);

      await addDoc(collection(db, "otop"), {
        Name: name.value,
        Description: description.value.trim(),
        Place: place.value,
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

oPop.addEventListener('click', () => {
  editAcc.style.display = 'block';
});
cPop.addEventListener('click', () => {
  editAcc.style.display = 'none';
});

// FOR EDIT FORM - UPDATE TO FIREBASE
const formEdit = document.getElementById('edit-form');
const name1 = document.getElementById('name1');
const description1 = document.getElementById('description1');
const place1 = document.getElementById('place1');
const photos1 = document.getElementById('photos1');

formEdit.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (validateInputs([name1, description1, place1])) {
    try {
      const userID = localStorage.getItem("ID");
      const photoFile = photos1.files[0];
      let photoURL;
      if (photoFile) {
        const photoRef = ref(storage, `otop/${photoFile.name}`);
        await uploadBytes(photoRef, photoFile);
        photoURL = await getDownloadURL(photoRef);
      }

      const updateData = {
        Name: name1.value,
        Description: description1.value,
        Place: place1.value
      };

      if (photoFile) {
        updateData.PhotoURL = photoURL;
      }

      await updateDoc(doc(db, "otop", userID), updateData);
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

// Populate table with data
const tbody = document.getElementById('tbody1');
const querySnapshot = await getDocs(collection(db, "otop"));
querySnapshot.forEach(doc => {
  if (doc.data()) {
    const trow = document.createElement('tr');
    trow.innerHTML = `
      <td>${doc.data().Name}</td>
      <td>${doc.data().Description}</td>
      <td>${doc.data().Place}</td>
        <td><img src="${doc.data().PhotoURL}" alt="Event Photo" width="150" height="150"></td>   
    `;
    tbody.appendChild(trow);

    trow.addEventListener('click', (e) => {
      localStorage.setItem('ID', doc.id);
      document.getElementById('name1').value = doc.data().Name;
      document.getElementById('description1').value = doc.data().Description;
      document.getElementById('place1').value = doc.data().Place;
      highlightRow(trow);
    });
  }
});

function highlightRow(row) {
  const rows = document.querySelectorAll('#tbody1 tr');
  rows.forEach(r => r.classList.remove('selected-row'));
  row.classList.add('selected-row');
  document.getElementById("edit_acc").disabled = false;
  document.getElementById("delete_acc").disabled = false;
}

// Auto-archive past events
async function autoArchivePastEvents() {
  const querySnapshot = await getDocs(collection(db, "otop"));
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
    await updateDoc(doc(db, "otop", userID), {
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
  window.location = "oArchives.html";
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

