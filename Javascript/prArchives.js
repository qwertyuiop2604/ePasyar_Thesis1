import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getFirestore, collection, getDocs, updateDoc, doc, setDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";

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

document.getElementById("localindustries").addEventListener("click", () => {
  window.location = "industries.html";
});

const archivedTbody = document.getElementById("archived-tbody");

const querySnap = await getDocs(collection(db, "users", "admin", "admin_account"));
querySnap.forEach((doc) => {
  if (doc.data().status === "Deleted") { // Remove the extra parenthesis here
    const trow = document.createElement("tr");
    trow.innerHTML = `
      <td>${doc.data().deletedBy}</td>
      <td>${doc.data().name}</td>
      <td>${doc.data().email}</td>
      <td>${doc.data().password}</td>
      <td>${doc.data().deletedDate}</td>
    `;
    archivedTbody.appendChild(trow);
    trow.addEventListener('click', () => {
      localStorage.setItem('ID', doc.id);
      highlightRow(trow);
    });
  }
});
function highlightRow(row) {
  // Remove the 'selected-row' class from all rows
  const rows = document.querySelectorAll('tr.selected-row');
  rows.forEach(row => row.classList.remove('selected-row'));

  // Add the 'selected-row' class to the clicked row
  row.classList.add('selected-row');
}

localStorage.setItem("ID", doc.id);
//console.log(doc.id)

//HIGHLIGHT TABLE ROW WHEN CLICKED - FINAL
var table = document.getElementById("table");
var rows = document.getElementsByTagName('tr');
for (let i = 1; i < rows.length; i++) {
  var currentRow = table.rows[i];
  currentRow.onclick = function () {
    Array.from(this.parentElement.children).forEach(function (el) {
      el.classList.remove('selected-row');

    });

    // [...this.parentElement.children].forEach((el) => el.classList.remove('selected-row'));
    this.classList.add('selected-row');

    document.getElementById("enabledbtn").disabled = false;


  }

}
currentRow.onclick = function () {
  // Remove highlight from other rows and highlight the clicked row
  highlightRow(this);
  document.getElementById("enabledbtn").disabled = false;
};

const enabledbtn = document.getElementById('enabledbtn');
if (enabledbtn) {
  enabledbtn.addEventListener('click', () => {
    document.getElementById('cnfrm_modal_enable').style.display = "block";
  });
}

// window.onload = GetAllDataOnce;

document.getElementById("enabledbtn").disabled = true; 

enabledbtn.addEventListener('click', () => {
  document.getElementById('cnfrm_modal_enable').style.display = "block";
});

cnl_promo3.addEventListener('click', (e) => {
  document.getElementById('cnfrm_modal_enable').style.display = "none";
});

const querySnap2 = await getDocs(collection(db, "users", "admin", "admin_account"));
querySnap2.forEach((doc2) => {
  document.getElementById('cnfrm_promo3').addEventListener('click', (e) => {
    const updateStats = doc(db, "users", "admin", "admin_account" ,localStorage.getItem("ID"));
  
    updateDoc(updateStats, {
      status: "Active",
      ArchivedBy: "",
      ArchivedDate: ""
    }).then(() => {
      window.location = "prArchives.html";
      window.location.reload();
    });
  });
});


// Event listener for permanently deleting an event
document.getElementById('permanentlyDelete').addEventListener('click', () => {
  document.getElementById('cnfrm_modal_delete').style.display = "block";
});

// Event listener for cancel button in delete confirmation modal
document.getElementById('cnl_delete').addEventListener('click', () => {
  document.getElementById('cnfrm_modal_delete').style.display = "none";
});

// Event listener for confirm button in delete confirmation modal
document.getElementById('cnfrm_delete').addEventListener('click', async () => {
  try {
    const docRef = doc(db,'users','admin', 'admin_account'  , localStorage.getItem("ID"));
    await deleteDoc(docRef);
    window.location = "prArchives.html";
    window.location.reload();
  } catch (error) {
    console.error("Error deleting document: ", error);
  }
});
