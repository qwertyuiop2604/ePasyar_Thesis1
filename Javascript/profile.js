import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-app.js";
import { getFirestore, setDoc, doc, getDocs, updateDoc, collection } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-auth.js";

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
const auth = getAuth(app);

// Navigation
let dash = document.getElementById("dash");
dash.addEventListener('click', () => window.location = 'dash.html');
let profile = document.getElementById("profile");
profile.addEventListener('click', () => window.location = 'profile.html');
let events = document.getElementById("events");
events.addEventListener('click', () => window.location = 'events.html');
let promotion = document.getElementById("promotion");
promotion.addEventListener('click', () => window.location = 'promotion.html');
let tourist = document.getElementById("tourist");
tourist.addEventListener('click', () => window.location = 'tourist.html');
let souvenir = document.getElementById("souvenir");
souvenir.addEventListener('click', () => window.location = 'souvenir.html');
let restaurant = document.getElementById("restaurant");
restaurant.addEventListener('click', () => window.location = 'restaurants.html');
let logout = document.getElementById("logout");
logout.addEventListener('click', () => window.location = 'index.html');
let reviews = document.getElementById("reviews");
reviews.addEventListener('click', () => window.location = 'reviews.html');
// Create Account Form Popup
const createAcc = document.getElementById('user-create');
const openPop = document.querySelector('.add_acc');
const closePop = document.querySelector('.close-modal');

openPop.addEventListener('click', () => createAcc.style.display = 'block');
closePop.addEventListener('click', () => createAcc.style.display = 'none');

// Register Form - Add to Firebase
const formCreate = document.getElementById('create-form');
const name = document.getElementById('name');
const email = document.getElementById('email');
const position = document.getElementById('position');
const btnRegister = document.getElementById('btnRegister'); // Add this line to get the register button

btnRegister.addEventListener('click', (e) => { // Add event listener for the register button click
  e.preventDefault();
  if (name.value === '' || email.value === '' || position.value === '') {
    alert("All fields are required.");
  
  } else {
    createUserWithEmailAndPassword(auth, email.value, "temp_password")
      .then((userCredential) => {
        const user = userCredential.user;
        setDoc(doc(db, "users", "admin", "admin_account", user.uid), {
          name: name.value,
          email: email.value,
          position: position.value,
          status: "Active"
        })
          .then(() => createAcc.style.display = 'none')
          .catch((error) => console.error("Error adding document: ", error));
      })
      .catch((error) => alert(error.message));
  }
});


// Edit Account Form Popup
const editAcc = document.getElementById('user-edit');
const oPop = document.querySelector('.edit_acc');
const cPop = document.querySelector('.close-modal-edit');

oPop.addEventListener('click', () => editAcc.style.display = 'block');
cPop.addEventListener('click', () => editAcc.style.display = 'none');

// Edit Form - Update to Firebase
const formEdit = document.getElementById('edit-form');
const name1 = document.getElementById('name1');
const email1 = document.getElementById('email1');
const positionEdit = document.getElementById('positionEdit'); 
const btnSaveEdit = document.getElementById('btnSaveEdit');

btnSaveEdit.addEventListener('click', async (e) => {
  e.preventDefault();
  if (name1.value === '' || email1.value === '' || positionEdit.value === '') { 
  
  } else {
    const userId = localStorage.getItem('ID');
    if (userId) {
      const userRef = doc(db, "users", "admin", "admin_account", userId);
      updateDoc(userRef, {
        name: name1.value,
        email: email1.value,
        position: positionEdit.value 
      })
        .then(() => {
          console.log("Document successfully updated!");
          editAcc.style.display = 'none';
        })
        .catch((error) => console.error("Error updating document: ", error));
    } else {
      console.error("No user ID found in localStorage");
    }
  }
});


// Populating table and setting up row click event
const tbody = document.getElementById('tbody1');

const querySnapshot = await getDocs(collection(db, "users", "admin", "admin_account"));
querySnapshot.forEach((doc) => {
  if (doc.data().status === "Active") {
    const trow = document.createElement('tr');
    const td1 = document.createElement('td');
    const td2 = document.createElement('td');
    const td3 = document.createElement('td');
    const td4 = document.createElement('td');
    const td5 = document.createElement('td'); // New cell for the toggle eye icon

    td1.textContent = doc.data().name;
    td2.textContent = doc.data().email;
    td3.textContent = doc.data().position;

    // Mask the password
    td4.textContent = '••••••••';
    td4.setAttribute('data-password', doc.data().password); // Store the actual password in a data attribute

    // Create the toggle eye icon
    const eyeIcon = document.createElement('i');
    eyeIcon.classList.add('fa', 'fa-eye'); // Assuming you are using FontAwesome for the eye icon
    eyeIcon.style.cursor = 'pointer';

    // Add event listener to toggle the password visibility
    eyeIcon.addEventListener('click', () => {
      if (td4.textContent === '••••••••') {
        td4.textContent = td4.getAttribute('data-password');
        eyeIcon.classList.remove('fa-eye');
        eyeIcon.classList.add('fa-eye-slash');
      } else {
        td4.textContent = '••••••••';
        eyeIcon.classList.remove('fa-eye-slash');
        eyeIcon.classList.add('fa-eye');
      }
    });

    td5.appendChild(eyeIcon);

    trow.appendChild(td1);
    trow.appendChild(td2);
    trow.appendChild(td3);
    trow.appendChild(td4);
    trow.appendChild(td5);

    tbody.appendChild(trow);

    trow.addEventListener('click', () => {
      localStorage.setItem('ID', doc.id);
      console.log(doc.id);
  
      document.querySelectorAll('tr').forEach(row => row.classList.remove('selected-row'));
      trow.classList.add('selected-row');
  
      document.getElementById("edit_acc").disabled = false;
      document.getElementById("edit_acc").classList.remove("disabled-button");
      document.getElementById("edit_acc").classList.add("enabled-button");
  
      document.getElementById("delete_acc").disabled = false;
      document.getElementById("delete_acc").classList.remove("disabled-button");
      document.getElementById("delete_acc").classList.add("enabled-button");
  
      document.getElementById('name1').value = doc.data().name;
      document.getElementById('email1').value = doc.data().email;
      document.getElementById('position').value = doc.data().position;
  });
  
  }
});


const currentDateTime = new Date().toLocaleString();

// Event Listener for delete account button
const btnDelete = document.getElementById('delete_acc');
btnDelete.addEventListener('click', () => {
  document.getElementById('delete_acc_modal').style.display = "block";
});

// Confirm delete account
const cnfrm2 = document.getElementById('confirm_delete');
cnfrm2.addEventListener('click', async () => {
  const userId = localStorage.getItem('ID');
  if (userId) {
    const userRef = doc(db, "users", "admin", "admin_account", userId);
    await updateDoc(userRef, {
      status: "Deleted",
      deletedBy: "ADMIN",
      deletedDate: currentDateTime
    })
    .then(() => {
      console.log("Document successfully updated to Deleted!");
      document.getElementById('delete_acc_modal').style.display = "none";
      window.location.reload(); // Reload the page to reflect changes
    })
    .catch((error) => console.error("Error updating document: ", error));
  } else {
    console.error("No user ID found in localStorage");
  }
});

// Cancel delete account
const cnl2 = document.getElementById('cancel_delete');
cnl2.addEventListener('click', () => {
  document.getElementById('delete_acc_modal').style.display = "none";
});

//Button to see archived accounts
const archived_acc = document.getElementById('archived_acc');
archived_acc.addEventListener('click', (e) => {
  window.location = "prArchives.html";
});

// Initial disabling of buttons
document.getElementById("edit_acc").disabled = true;
document.getElementById("delete_acc").disabled = true;

// Deselect rows when clicking outside the table
document.addEventListener('click', (event) => {
  const table = document.getElementById('table');
  const isClickInsideTable = table.contains(event.target);
  if (!isClickInsideTable) {
    // Deselect all rows
    document.querySelectorAll('tr').forEach(row => row.classList.remove('selected-row'));

    // Disable buttons
    document.getElementById("edit_acc").disabled = true;
    document.getElementById("edit_acc").classList.remove("enabled-button");
    document.getElementById("edit_acc").classList.add("disabled-button");

    document.getElementById("delete_acc").disabled = true;
    document.getElementById("delete_acc").classList.remove("enabled-button");
    document.getElementById("delete_acc").classList.add("disabled-button");
  }
});

//Button to see archived accounts
archived_acc.addEventListener('click', (e) => {
  window.location = "prArchives.html"
})

