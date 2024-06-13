import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-app.js";
import {
  getFirestore,
  addDoc,
  collection,
  getDocs,
  updateDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/9.1.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-storage.js";

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
const storage = getStorage(app);

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

let restaurant = document.getElementById("restaurant");
restaurant.addEventListener('click', () =>{
  window.location = 'restaurants.html'
})
let logout = document.getElementById("logout");
logout.addEventListener("click", () => {
  window.location = "index.html";
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
document.addEventListener('DOMContentLoaded', function () {
  var dropdown = document.querySelector('.dropdown-btn');
  var dropdownContent = document.querySelector('.dropdown-container');
  dropdown.addEventListener('click', function () {
    dropdownContent.classList.toggle('show');
  });
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
const photos = document.getElementById('photos');

formCreate.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (validateInputs([categorySelect, name, owner,number,location, photos])) {
    try {
      const photoFile = photos.files[0];
      const photoRef = ref(storage, `souvenir/${photoFile.name}`);
      await uploadBytes(photoRef, photoFile);
      const photoURL = await getDownloadURL(photoRef);

      await addDoc(collection(db, "vigan_establishments"), {
        Category: categorySelect.value,
        Name: name.value,
        Owner: owner.value,
        Number: number.value,
        Location: location.value,
        PhotoURL: photoURL,
        Status: "Shop Open"
      });
      createAcc.style.display = 'none';
      window.location.reload(); // Reload to refresh the table
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
const photos1 = document.getElementById('photos1');

formEdit.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (validateInputs([categorySelect1, name1, number1,location1, photos1])) {
    try {
      const userID = localStorage.getItem("ID");
      const photoFile = photos1.files[0];
      let photoURL;
      if (photoFile) {
        const photoRef = ref(storage, `souvenir/${photoFile.name}`);
        await uploadBytes(photoRef, photoFile);
        photoURL = await getDownloadURL(photoRef);
      }

      const updateData = {
        Category: categorySelect1.value,
        Name: name1.value,
        Owner: owner1.value,
        Number: number1.value,
        Location: location1.value,
        PhotoURL: photoURL // Update the PhotoURL if a new photo is uploaded
      };

      if (photoFile) {
        updateData.PhotoURL = photoURL;
      }

      await updateDoc(doc(db, "vigan_establishments", userID), updateData);
      editAcc.style.display = 'none'; // Close the edit form
      window.location.reload(); // Reload to refresh the table
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  }
});

 // Populate table with data
 const tbody = document.getElementById('tbody1');
 const querySnapshot = await getDocs(collection(db, "vigan_establishments"));
 querySnapshot.forEach(doc => {
   if (doc.data().Status === "Shop Open") {
     const trow = document.createElement('tr');
     trow.innerHTML = `
       <td>${doc.data().Name}</td>
       <td>${doc.data().Owner}</td>
       <td>${doc.data().Number}</td>
       <td>${doc.data().Location}</td>
       <td><img src="${doc.data().PhotoURL}" alt="Event Photo" width="50" height="50"></td>
     `;
     tbody.appendChild(trow);

     trow.addEventListener('click', (e) => {
       localStorage.setItem('ID', doc.id);
       document.getElementById('category1').value = doc.data().Category;
       document.getElementById('name1').value = doc.data().Name;
       document.getElementById("owner1").value = doc.data().Owner;
       document.getElementById("number1").value = doc.data().Number;
       document.getElementById("location1").value = doc.data().Location;
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
        
// Archive event instead of deleting
const currentDateTime = new Date().toLocaleString();
document.getElementById('delete_acc').addEventListener('click', async () => {
  const userID = localStorage.getItem("ID");
  try {
    await updateDoc(doc(db, "vigan_establishments", userID), {
      Status: "Shop Closed",
      ArchivedBy: "ADMIN", // Replace with the actual admin's name if needed
      ArchivedDate: currentDateTime
    });
    window.location.reload(); // Reload to refresh the table
  } catch (error) {
    console.error("Error updating document: ", error);
  }
});



//Button to see archived accounts
archived_acc.addEventListener("click", (e) => {
  window.location = "sArchives.html";
});
