import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-app.js";
import {
  getFirestore,
  addDoc,
  collection,
  getDocs,
  updateDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/9.1.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyA6U1In2wlItYioP3yl43C3hCgiXUZ4oKI",
  authDomain: "epasyar-aa569.firebaseapp.com",
  databaseURL: "https://epasyar-aa569-default-rtdb.firebaseio.com",
  projectId: "epasyar-aa569",
  storageBucket: "epasyar-aa569.appspot.com",
  messagingSenderId: "1004550371893",
  appId: "1:1004550371893:web:692e667675470640980f7c",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let dash = document.getElementById("dash");
dash.addEventListener("click", () => {
  window.location = "dash.html";
});
let profile = document.getElementById("profile");
profile.addEventListener("click", () => {
  window.location = "profile.html";
});
let promotion = document.getElementById("promotion");
promotion.addEventListener("click", () => {
  window.location = "promotion.html";
});
let events = document.getElementById("events");
events.addEventListener("click", () => {
  window.location = "events.html";
});
let tourist = document.getElementById("tourist");
tourist.addEventListener("click", () => {
  window.location = "tourist.html";
});
let souvenir = document.getElementById("souvenir");
souvenir.addEventListener('click', () =>{
  window.location = 'souvenir.html'});

let logout = document.getElementById("logout");
logout.addEventListener("click", () => {
  window.location = "index.html";
});
let reviews = document.getElementById("reviewS");
reviews.addEventListener("click", () => {
  window.location = "reviews.html";
});


// CREATE FORM POPUP
const createAcc = document.getElementById("user-create");
const openPop = document.querySelector(".add_acc");
const closePop = document.querySelector(".close-modal");

openPop.addEventListener("click", () => {
  createAcc.style.display = "block";
});
closePop.addEventListener("click", () => {
  createAcc.style.display = "none";
});

// FOR REGISTER FORM - ADD TO FIREBASE
const formCreate = document.getElementById("create-form");
const categorySelect = document.getElementById("category");
const name = document.getElementById("name");
const owner = document.getElementById("owner");
const number = document.getElementById("number");
const location = document.getElementById("location");

formCreate.addEventListener("submit", (e) => {
  e.preventDefault();
  const selectedCategory = categorySelect.value;

  if (selectedCategory === "blank") {
    alert("SELECT A CATEGORY");
  } else if (name.value === "") {
    alert("ENTER SHOP NAME");
  } else if (owner.value === "") {
    alert("ENTER OWNER NAME");
  } else if (number.value === "") {
    alert("ENTER CONTACT NUMBER");
  } else if (location.value === "") {
    alert("ENTER LOCATION");
  } else {
    addDoc(collection(db, "vigan_establishments"), {
      Category: selectedCategory,
      Name: name.value,
      Owner: owner.value,
      Number: number.value,
      Location: location.value,
      Status: "Shop Available",
    })
      .then(() => {
        createAcc.style.display = "none";
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
      });
  }
});

// FOR EDIT MODAL CONFIRMATION
const confirmation = document.getElementById("cnfrm_edit");
const cancel = document.querySelector(".cnl");
const confirm = document.querySelector(".cnfrm");

cancel.addEventListener("click", () => {
  confirmation.style.display = "none";
  editAcc.style.display = "block";
});

//Edit FORM POPUP
const editAcc = document.getElementById("user-edit");
const oPop = document.querySelector(".edit_acc");
const cPop = document.querySelector(".close-modal-edit");

oPop.addEventListener("click", () => {
  editAcc.style.display = "block";
});
cPop.addEventListener("click", () => {
  editAcc.style.display = "none";
});

// FOR EDIT FORM - UPDATE TO FIREBASE
const formEdit = document.getElementById("edit-form");
const categorySelect1 = document.getElementById("category1");
const name1 = document.getElementById("name1");
const owner1 = document.getElementById("owner1");
const number1 = document.getElementById("number1");
const location1 = document.getElementById("location1");

formEdit.addEventListener("submit", (e) => {
  e.preventDefault();
  if (categorySelect1.value === "blank") {
    alert("SELECT A CATEGORY");
  } else if (name1.value === "") {
    alert("ENTER SHOP NAME");
  } else if (owner1.value === "") {
    alert("ENTER OWNER NAME");
  } else if (number1.value === "") {
    alert("ENTER CONTACT NUMBER");
  } else if (location1.value === "") {
    alert("ENTER LOCATION");
  } else {
    confirmation.style.display = "block";
    editAcc.style.display = "none";
  }
});

// FINAL
var tbody = document.getElementById("tbody1");

const querySnapshot = await getDocs(collection(db, "vigan_establishments"));
querySnapshot.forEach((doc) => {
  if (doc.data().Status == "Shop Available") {
    var trow = document.createElement("tr");
    let td1 = document.createElement("td");
    let td2 = document.createElement("td");
    let td3 = document.createElement("td");
    let td4 = document.createElement("td");
    let td5 = document.createElement("td");

    td1.innerHTML = doc.data().Category;
    td2.innerHTML = doc.data().Name;
    td3.innerHTML = doc.data().Owner;
    td4.innerHTML = doc.data().Number;
    td5.innerHTML = doc.data().Location;

    trow.appendChild(td1);
    trow.appendChild(td2);
    trow.appendChild(td3);
    trow.appendChild(td4);
    trow.appendChild(td5);

    tbody.appendChild(trow);

    trow.addEventListener("click", (e) => {
      localStorage.setItem("ID", doc.id);
      console.log(doc.id);

      //HIGHLIGHT TABLE ROW WHEN CLICKED
      var table = document.getElementById("table");
      var rows = document.getElementsByTagName("tr");
      for (let i = 1; i < rows.length; i++) {
        var currentRow = table.rows[i];
        currentRow.onclick = function () {
          Array.from(this.parentElement.children).forEach(function (el) {
            el.classList.remove("selected-row");
          });

          this.classList.add("selected-row");

          document.getElementById("edit_acc").disabled = false;
          document.getElementById("delete_acc").disabled = false;

          document.getElementById("category1").value = doc.data().Category;
          document.getElementById("name1").value = doc.data().Name;
          document.getElementById("owner1").value = doc.data().Owner;
          document.getElementById("number1").value = doc.data().Number;
          document.getElementById("location1").value = doc.data().Location;
        };
      }
    });
  }
});
const currentDateTime = new Date().toLocaleString();

const querySnapshot2 = await getDocs(collection(db, "vigan_establishments"));
querySnapshot2.forEach((doc2) => {
  const confirmEdit = document.getElementById("cnfrm");

  confirmEdit.addEventListener("click", (e) => {
    const updateEvents = doc(db, "vigan_establishments", doc2.id);
    var userID = localStorage.getItem("ID");

    if (userID == doc2.id) {
      updateDoc(updateEvents, {
        Category: document.getElementById("category1").value,
        Name: document.getElementById("name1").value,
        Owner: document.getElementById("owner1").value,
        Number: document.getElementById("number1").value,
        Location: document.getElementById("location1").value,
      })
        .then(() => {
          confirmation.style.display = "none";
        })
        .catch((error) => {
          console.error("Error updating document: ", error);
        });
    }
  });

  cnfrm2.addEventListener('click', (e) => {
    const updateEvents = doc(db, "vigan_establishments", doc2.id)
    var userID = localStorage.getItem("ID")

    if (userID == doc2.id) {
      updateDoc(updateEvents, {
        Status: "Shop Not Available",
            DeletedBy: "ADMIN",
            DeletedDate: currentDateTime
      }).then(() => {
        delete_acc_modal.style.display = 'none';
      }).catch((error) => {
        console.error("Error updating document: ", error);
      });
    }
  }); 
});


const btnDelete = document.getElementById("delete_acc");
const btnEdit = document.getElementById("btnEdit");
// Event Listener for delete account button - FINAL
btnDelete.addEventListener("click", (e) => {
  document.getElementById("delete_acc_modal").style.visibility = "visible";
});
cnl2.addEventListener("click", (e) => {
  document.getElementById("delete_acc_modal").style.visibility = "hidden";
  window.location = "restaurants.html";
});

//Button to see archived accounts
archived_acc.addEventListener("click", (e) => {
  window.location = "rArchives.html";
});
