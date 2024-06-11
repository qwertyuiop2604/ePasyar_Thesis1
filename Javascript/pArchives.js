
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

let bckbtn = document.getElementById("bckbtn");
bckbtn.addEventListener('click', () => {
    window.location = 'promotion.html'
})
let events = document.getElementById("events");
events.addEventListener('click', () => {
    window.location = 'events.html'
})
let souvenir = document.getElementById("souvenir");
souvenir.addEventListener('click', () =>{
  window.location = 'souvenir.html'
})
let logout = document.getElementById("logout");
logout.addEventListener('click', () =>{
  window.location = 'index.html'
})
let reviews = document.getElementById("reviews");
reviews.addEventListener("click", () => {
  window.location = "reviews.html";
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

// FINAL
const archivedTbody = document.getElementById("archived-tbody");

const querySnap = await getDocs(collection(db, "vigan_establishments"));
querySnap.forEach((doc) => {
  if (doc.data().Status === "Not Available") {
    const trow = document.createElement("tr");
    trow.innerHTML = `
      <td>${doc.data().ArchivedBy}</td>
      <td>${doc.data().Name}</td>
      <td>${doc.data().Owner}</td>
      <td>${doc.data().Number}</td>
      <td>${doc.data().Email}</td>
      <td>${doc.data().Address}</td>
      <td>${doc.data().Rooms}</td>
      <td>${doc.data().Capacity}</td>
      <td>${doc.data().Rates}</td>
      <td><img src="${doc.data().PhotoURL}" alt="Event Photo" width="50" height="50"></td>
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

    document.getElementById("enabledbtn").disabled = false;
  };
}

// window.onload = GetAllDataOnce;

document.getElementById('enabledbtn').addEventListener('click', () => {
  document.getElementById('cnfrm_modal_enable').style.display = "block";
});

document.getElementById('cnl_promo3').addEventListener('click', () => {
  document.getElementById('cnfrm_modal_enable').style.display = "none";
});

const querySnap2 = await getDocs(collection(db, "vigan_establishments"));
querySnap2.forEach((doc2) => {
  document.getElementById('cnfrm_promo3').addEventListener('click', (e) => {
    const updateStats = doc(db, "vigan_establishments", localStorage.getItem("ID"));
  
    updateDoc(updateStats, {
      Status: "Available",
      ArchivedBy: "",
      ArchivedDate: ""
    }).then(() => {
      window.location = "pArchives.html";
      window.location.reload();
    });
  });
});