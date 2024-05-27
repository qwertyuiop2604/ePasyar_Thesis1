// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-app.js";
import { getFirestore, addDoc, collection, getDocs, updateDoc, doc } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-storage.js";

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
document.getElementById("dash").addEventListener('click', () => { window.location = 'dash.html'; });
document.getElementById("profile").addEventListener('click', () => { window.location = 'profile.html'; });
document.getElementById("promotion").addEventListener('click', () => { window.location = 'promotion.html'; });
document.getElementById("tourist").addEventListener('click', () => { window.location = 'tourist.html'; });
document.getElementById("souvenir").addEventListener('click', () => { window.location = 'souvenir.html'; });
document.getElementById("logout").addEventListener('click', () => { window.location = 'index.html'; });
document.getElementById("reviews").addEventListener('click', () => { window.location = 'reviews.html'; });

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
const date = document.getElementById('date');
const description = document.getElementById('description');

formCreate.addEventListener('submit', (e) => {
  e.preventDefault();
  if (validateInputs([name, date, description])) {
    addDoc(collection(db, "festivals"), {
      Name: name.value,
      Date: date.value,
      Description: description.value.trim(),
      Status: "not done"
    }).then(() => {
      createAcc.style.display = 'none';
    }).catch((error) => {
      console.error("Error adding document: ", error);
    });
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

// FOR EDIT MODAL CONFIRMATION - FINAL
const confirmation = document.getElementById('cnfrm_edit')
const cancel = document.querySelector('.cnl')
const confirm = document.querySelector('.cnfrm')

cancel.addEventListener('click', () => {
    confirmation.style.display = 'none'
    modalEdit.style.display = 'block';
    confirm.style.display = 'none';
});

//Edit FORM POPUP
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
const date1 = document.getElementById('date1');
const description1 = document.getElementById('description1');

formEdit.addEventListener('submit', (e) => {
  e.preventDefault();
  if (validateInputs([name1, date1, description1])) {
    confirmation.style.display = 'block';
    editAcc.style.display = 'none';
  }
});

// Populate table with data
const tbody = document.getElementById('tbody1');
const querySnapshot = await getDocs(collection(db, "festivals"));
querySnapshot.forEach(doc => {
  if (doc.data().Status == "not done") {
    const trow = document.createElement('tr');
    trow.innerHTML = `
      <td>${doc.data().Name}</td>
      <td>${doc.data().Date}</td>
      <td>${doc.data().Description}</td>
    `;
    tbody.appendChild(trow);

    trow.addEventListener('click', (e) => {
      localStorage.setItem('ID', doc.id);
      document.getElementById('name1').value = doc.data().Name;
      document.getElementById('date1').value = doc.data().Date;
      document.getElementById('description1').value = doc.data().Description;
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

// Update event
const currentDateTime = new Date().toLocaleString();
const querySnapshot2 = await getDocs(collection(db, "festivals"));
querySnapshot2.forEach(doc2 => {
  document.getElementById('cnfrm').addEventListener('click', async () => {
    const userID = localStorage.getItem("ID");
    if (userID == doc2.id) {
      await updateDoc(doc(db, "festivals", doc2.id), {
        Name: name1.value,
        Date: date1.value,
        Description: description1.value
      });
      confirmation.style.display = 'none';
    }
  });

  document.getElementById('cnfrm2').addEventListener('click', async () => {
    const userID = localStorage.getItem("ID");
    if (userID == doc2.id) {
      await updateDoc(doc(db, "festivals", doc2.id), {
        Status: "done",
        DeletedBy: "ADMIN",
        DeletedDate: currentDateTime
      });
      document.getElementById('delete_acc_modal').style.visibility = "hidden";
    }
  });
});

// Delete event
document.getElementById('delete_acc').addEventListener('click', () => {
  document.getElementById('delete_acc_modal').style.visibility = "visible";
});
document.getElementById('cnl2').addEventListener('click', () => {
  document.getElementById('delete_acc_modal').style.visibility = "hidden";
  window.location = "events.html";
});

// Button to see archived accounts
document.getElementById('archived_acc').addEventListener('click', () => {
  window.location = "archives.html";
});

// Calendar functionality
const monthElement = document.querySelector('.month ul li span');
const daysElement = document.querySelector('.days');
const prevButton = document.querySelector('.prev');
const nextButton = document.querySelector('.next');

let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function renderCalendar(month, year) {
  monthElement.innerHTML = `${months[month]}<br><span style="font-size:18px">${year}</span>`;
  daysElement.innerHTML = '';

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let i = 0; i < firstDayOfMonth; i++) {
    daysElement.innerHTML += `<li></li>`;
  }

  for (let i = 1; i <= daysInMonth; i++) {
    daysElement.innerHTML += `<li>${i}</li>`;
  }
}

prevButton.addEventListener('click', () => {
  currentMonth--;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  renderCalendar(currentMonth, currentYear);
});

nextButton.addEventListener('click', () => {
  currentMonth++;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  renderCalendar(currentMonth, currentYear);
});

renderCalendar(currentMonth, currentYear);
