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
let souvenir = document.getElementById("souvenir");
souvenir.addEventListener('click', () =>{
  window.location = 'souvenir.html'});

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
const name = document.getElementById("name");
const type = document.getElementById('type');
const number = document.getElementById("number");
const location = document.getElementById("location");
const photos = document.getElementById('photos');

formCreate.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (validateInputs([ name,type,number,location, photos])) {
    try {
      const photoFile = photos.files[0];
      const photoRef = ref(storage, `restaurant/${photoFile.name}`);
      await uploadBytes(photoRef, photoFile);
      const photoURL = await getDownloadURL(photoRef);

      await addDoc(collection(db, "vigan_establishments"), {
        Category: "Restaurant",
        Name: name.value,
        Type: type.value,
        Number: number.value,
        Location: location.value,
        PhotoURL: photoURL,
        Status: "R Shop Open"
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
const name1 = document.getElementById("name1");
const type1 = document.getElementById("type1");
const number1 = document.getElementById("number1");
const location1 = document.getElementById("location1");
const photos1 = document.getElementById('photos1');

formEdit.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (validateInputs([name1,type1, number1,location1, photos1])) {
    try {
      const userID = localStorage.getItem("ID");
      const photoFile = photos1.files[0];
      let photoURL;
      if (photoFile) {
        const photoRef = ref(storage, `restaurant/${photoFile.name}`);
        await uploadBytes(photoRef, photoFile);
        photoURL = await getDownloadURL(photoRef);
      }

      const updateData = {
        Category: "Restaurant",
        Name: name1.value,

        Type: type1.value,
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
// Fetch documents from Firestore and assign to querySnapshot
async function fetchEstablishments() {
  try {
    const querySnapshot = await getDocs(collection(db, "vigan_establishments"));
    const tbody = document.getElementById('tbody1'); // Make sure tbody is defined

    querySnapshot.forEach(doc => {
      if (doc.data().Status === "R Shop Open") {
        const trow = document.createElement('tr');
        trow.innerHTML = `
          <td>${doc.data().Name}</td>
          <td>${doc.data().Type}</td>
          <td>${doc.data().Number}</td>
          <td>${doc.data().Location}</td>
            <td><img src="${doc.data().PhotoURL}" alt="Event Photo" width="150" height="150"></td>   
          <td><button id="gen_qr_${doc.id}" class="gen-qr-btn">Generate QR</button></td>
        `;
        tbody.appendChild(trow);

        trow.addEventListener('click', (e) => {
          localStorage.setItem('ID', doc.id);
          document.getElementById('name1').value = doc.data().Name;
          document.getElementById("type1").value = doc.data().Type;
          document.getElementById("number1").value = doc.data().Number;
          document.getElementById("location1").value = doc.data().Location;
          highlightRow(trow);
        });

        // QR Code generation and display
        const qrBtn = document.getElementById(`gen_qr_${doc.id}`);
        let qrCodeData; // Variable to store QR code data URL

        qrBtn.addEventListener("click", async (e) => {
          e.stopPropagation(); // Prevent click from propagating to row click event

          if (!qrCodeData) {
            // Generate the QR code if it hasn't been generated yet
            qrBtn.textContent = "Generating QR...";
            qrBtn.disabled = true;

            qrCodeData = await generateQRCode(doc.data().Name, doc.id);
            qrBtn.textContent = "View My QR Code";
            qrBtn.disabled = false;
          } else {
            // Show the QR code in a modal within the table
            showQRCodeModal(qrCodeData, doc.data().Name);
          }
        });
      }
    });
  } catch (error) {
    console.error("Error fetching documents: ", error);
  }
}

// Function to generate QR code and return its data URL
async function generateQRCode(establishmentName, documentId) {
  const qrCodeContainer = document.createElement('div');
  const qrCode = new QRCode(qrCodeContainer, {
    text: documentId, // Use the document ID as the QR code content
    width: 700,
    height: 700,
    colorDark: "#000000", // Dark color
    colorLight: "#ffffff", // Light color
  });

  // Return the QR code data URL after it's been generated
  return new Promise((resolve) => {
    setTimeout(() => {
      const qrImageData = qrCodeContainer.querySelector('img').src;
      resolve(qrImageData);
    }, 1000); // Wait for QR code to be generated
  });
}

// Function to display QR code in a modal
function showQRCodeModal(qrCodeData, establishmentName) {
  // Create the modal container
  const modal = document.createElement('div');
  modal.classList.add('qr-modal');

  // Set up modal content
  modal.innerHTML = `
    <div class="qr-modal-content">
      <span class="qr-close">&times;</span>
      <h3>QR Code for ${establishmentName}</h3>
      <img src="${qrCodeData}" alt="QR Code for ${establishmentName}">
    </div>
  `;

  // Append modal to the document body
  document.body.appendChild(modal);

  // Show the modal
  modal.style.display = 'block';

  // Add event listener to close the modal
  modal.querySelector('.qr-close').addEventListener('click', () => {
    modal.style.display = 'none';
    modal.remove();
  });
}

fetchEstablishments();

// Add some CSS for the modal (you can adjust as needed)
const style = document.createElement('style');
style.innerHTML = `
  .qr-modal {
    display: none;
    position: fixed;
    z-index: 1000;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(0, 0, 0, 0.4);
  }
  .qr-modal-content {
    background-color: #fefefe;
    margin: 15% auto;
    padding: 20px;
    border: 1px solid #888;
    width: 50%;
    text-align: center;
  }
  .qr-modal-content img {
    width: 200px;
    height: 200px;
  }
  .qr-close {
    color: #aaa;
    float: right;
    font-size: 28px;
    font-weight: bold;
  }
  .qr-close:hover,
  .qr-close:focus {
    color: black;
    text-decoration: none;
    cursor: pointer;
  }
`;
document.head.appendChild(style);


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
      Status: "R Shop Closed",
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
  window.location = "rArchives.html";
});