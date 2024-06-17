import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getFirestore, collection, getDocs, updateDoc, doc, setDoc } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";

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

document.getElementById("bckbtn").addEventListener('click', () => {
  window.location = 'profile.html';
});

document.getElementById("events").addEventListener('click', () => {
  window.location = 'events.html';
});

document.getElementById("logout").addEventListener('click', () => {
  window.location = 'index.html';
});

document.getElementById("otop").addEventListener("click", () => {
  window.location = "otop.html";
});

document.getElementById("localdishes").addEventListener("click", () => {
  window.location = "dishes.html";
});

document.getElementById("localindustries").addEventListener("click", () => {
  window.location = "industries.html";
});

const archivedTbody = document.getElementById("archived-tbody");

const querySnap = await getDocs(collection(db, "users/admin/admin_account"));
querySnap.forEach((doc) => {
  if (doc.exists()) {
    const data = doc.data();
    const row = `
      <tr>
        <td>${data.deletedBy || ''}</td>
        <td>${data.name || ''}</td>
        <td>${data.email || ''}</td>
        <td>${data.password || ''}</td>
        <td>${data.deletedDate || ''}</td>
      </tr>
    `;
    archivedTbody.insertAdjacentHTML('beforeend', row);
  }
});

document.getElementById('enabledbtn').addEventListener('click', () => {
  document.getElementById('cnfrm_modal_enable').style.display = 'block';
});

document.getElementById('permanentlyDelete').addEventListener('click', () => {
  document.getElementById('cnfrm_modal_delete').style.display = 'block';
});

document.getElementById('cnl_promo3').addEventListener('click', () => {
  document.getElementById('cnfrm_modal_enable').style.display = 'none';
});

document.getElementById('cnl_delete').addEventListener('click', () => {
  document.getElementById('cnfrm_modal_delete').style.display = 'none';
});

document.getElementById('cnfrm_promo3').addEventListener('click', async () => {
  document.getElementById('cnfrm_modal_enable').style.display = 'none';
  const selectedRow = document.querySelector('tr.selected');
  if (selectedRow) {
    const email = selectedRow.querySelector('td:nth-child(3)').innerText;
    const userRef = doc(db, "users/admin/admin_account", email);
    await updateDoc(userRef, {
      archived: false
    });
    location.reload();
  }
});

document.getElementById('cnfrm_delete').addEventListener('click', async () => {
  document.getElementById('cnfrm_modal_delete').style.display = 'none';
  const selectedRow = document.querySelector('tr.selected');
  if (selectedRow) {
    const email = selectedRow.querySelector('td:nth-child(3)').innerText;
    const userRef = doc(db, "users", email);
    await setDoc(userRef, {
      deleted: true
    });
    location.reload();
  }
});

// Ensure rows can be selected
const table = document.getElementById('table');
table.addEventListener('click', (event) => {
  const targetRow = event.target.closest('tr');
  if (targetRow) {
    const rows = table.querySelectorAll('tr');
    rows.forEach(row => row.classList.remove('selected'));
    targetRow.classList.add('selected');
  }
});
