

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
let graph = document.getElementById("graph");
graph.addEventListener("click", () => {
  window.location = "table.html";
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
let rewards = document.getElementById("reward");
rewards.addEventListener("click", () => {
  window.location = "redeem.html";
});

// CREATE FORM POPUP
const createAcc = document.getElementById("user-create");
const openPop = document.querySelector(".add_acc");
const closePop = document.querySelector(".close-modal");

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
const formCreate = document.getElementById("create-form");

const name = document.getElementById("name");
const number = document.getElementById("number");
const location = document.getElementById("location");
const photos = document.getElementById('photos');

formCreate.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (validateInputs([ name,number,location, photos])) {
    try {
      const photoFile = photos.files[0];
      const photoRef = ref(storage, `souvenir/${photoFile.name}`);
      await uploadBytes(photoRef, photoFile);
      const photoURL = await getDownloadURL(photoRef);

      await addDoc(collection(db, "vigan_establishments"), {
        Category: "Souvenir Shop",
        Name: name.value,
        Number: number.value,
        Location: location.value,
        PhotoURL: photoURL,
        Status: "S Shop Open"
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
const formEdit = document.getElementById("edit-form");
const name1 = document.getElementById("name1");
const number1 = document.getElementById("number1");
const location1 = document.getElementById("location1");
const photos1 = document.getElementById('photos1');

formEdit.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (validateInputs([ name1, number1,location1, photos1])) {
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
        Category: "Souvenir Shop",
        Name: name1.value,

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
      const tbody = document.getElementById('tbody1');
  
      querySnapshot.forEach(doc => {
        if (doc.data().Status === "S Shop Open") {
          const trow = document.createElement('tr');
          trow.innerHTML = `
            <td>${doc.data().Name}</td>
         <td><button id="details_${doc.id}" class="details-btn">Show Details</button></td> <!-- Show Details Button -->
            <td><button id="gen_qr_${doc.id}" class="gen-qr-btn">Generate QR</button></td>
                 <td><button id="reviews_${doc.id}" class="reviews-btn">See Reviews</button></td> <!-- See Reviews Button -->
          `;
          tbody.appendChild(trow);

          trow.addEventListener('click', (e) => {
            localStorage.setItem('ID', doc.id);
            document.getElementById('name1').value = doc.data().Name;
            document.getElementById("number1").value = doc.data().Number;
            document.getElementById("location1").value = doc.data().Location;
        
            highlightRow(trow);
            
          });

          const detailsBtn = document.getElementById(`details_${doc.id}`);
          detailsBtn.addEventListener('click', (e) => {
              e.stopPropagation();
              showDetailsModal(doc.data());
          });

          function showDetailsModal(data) {
            document.getElementById("details-name").textContent = data.Name;
            document.getElementById("details-number").textContent = data.Number;
            document.getElementById("details-location").textContent = data.Location;
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
          
        
           // See Reviews button - Redirect to rev_tourist.html
 const reviewsBtn = document.getElementById(`reviews_${doc.id}`);
 reviewsBtn.addEventListener('click', (e) => {
     e.stopPropagation();
     // Redirect to rev_tourist.html and pass the doc.id as a URL parameter
     window.location.href = `rev_souvenir.html?docId=${doc.id}`;
 });

          // QR Code generation and display
          const qrBtn = document.getElementById(`gen_qr_${doc.id}`);
          let qrCodeData;

          qrBtn.addEventListener("click", async (e) => {
            e.stopPropagation();

            if (!qrCodeData) {
              qrBtn.textContent = "Generating QR...";
              qrBtn.disabled = true;

              qrCodeData = await generateQRCode(doc.data().Name, doc.id);
              qrBtn.textContent = "View My QR Code";
              qrBtn.disabled = false;
            } else {
              showQRCodeModal(qrCodeData, doc.data().Name);
            }
          });
        }
      });
    } catch (error) {
      console.error("Error fetching documents: ", error);
    }
  }

  fetchEstablishments();

  // Add QR code functions and event handlers properly
  async function generateQRCode(establishmentName, documentId) {
    const qrCodeContainer = document.createElement('div');
    const qrCode = new QRCode(qrCodeContainer, {
      text: documentId,
      width: 500,
      height: 500,
      colorDark: "#000000",
      colorLight: "#ffffff",
    });

    return new Promise((resolve) => {
      setTimeout(() => {
        const qrImageData = qrCodeContainer.querySelector('img').src;
        resolve(qrImageData);
      }, 1000);
    });
  }

  function showQRCodeModal(qrCodeData, establishmentName) {
    const modal = document.createElement('div');
    modal.classList.add('qr-modal');
    modal.innerHTML = `
      <div class="qr-modal-content">
        <span class="qr-close">&times;</span>
        <h3>QR Code for ${establishmentName}</h3>
        <img src="${qrCodeData}" alt="QR Code for ${establishmentName}">
        <br>
      <a id="download-qr-btn" href="${qrCodeData}" download="${establishmentName}_QRCode.png">
        <button class="download-btn"> Download QR Code</button>
      </a>
        </div>
    `;
    document.body.appendChild(modal);
    modal.style.display = 'block';
    modal.querySelector('.qr-close').addEventListener('click', () => {
      modal.style.display = 'none';
      modal.remove();
    });
  }

  // Add CSS for modal dynamically
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
  const rows = document.querySelectorAll("#tbody1 tr");
  rows.forEach((r) => r.classList.remove("selected-row"));
  row.classList.add("selected-row");
  document.getElementById("edit_acc").disabled = false;
  document.getElementById("delete_acc").disabled = false;
}
function toggleBlur(shouldBlur) {
  const container = document.querySelector('.main-container'); // Select the common container
  if (shouldBlur) {
    container.classList.add('blur-background');
  } else {
    container.classList.remove('blur-background');
  }
}

//Button to see archived accounts
archived_acc.addEventListener("click", (e) => {
  window.location = "sArchives.html";
});

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

    document.getElementById("delete_acc").disabled = false;
  };
}
// window.onload = GetAllDataOnce;

document.getElementById('delete_acc').addEventListener('click', () => {
  document.getElementById('delete_acc_modal').style.display = "block";
});

document.getElementById('delete_cancel').addEventListener('click', () => {
  document.getElementById('delete_acc_modal').style.display = "none";
});

const querySnap2 = await getDocs(collection(db, "vigan_establishments"));
querySnap2.forEach((doc2) => {
  document.getElementById('delete_confirm').addEventListener('click', (e) => {
    const updateStats = doc(db, "vigan_establishments", localStorage.getItem("ID"));
  
    updateDoc(updateStats, {
      Status: "S Shop Closed",
      ArchivedBy: "ADMIN", // Replace with the actual admin's name if needed
 ArchivedDate: new Date().toLocaleString()
    }).then(() => {
      window.location = "sArchives.html";
      window.location.reload();
    });
  });
});

// Get the modal elements
let logoutModal = document.getElementById("logout");
let modal = document.getElementById("logoutModal");
let closeBtn = document.getElementsByClassName("close")[0];
let confirmBtn = document.getElementById("confirmLogout");
let cancelBtn = document.getElementById("cancelLogout");
let logout = document.getElementById("logout");

// Show the logout modal when the logout button is clicked
logout.addEventListener("click", (event) => {
  event.preventDefault(); // Prevent default link behavior
  modal.style.display = "block"; // Show the logout modal
});

// Close the modal when the "x" button is clicked
closeBtn.onclick = function() {
  modal.style.display = "none"; // Hide the modal
};

// Close the modal when the cancel button is clicked
cancelBtn.onclick = function() {
  modal.style.display = "none"; // Hide the modal
};

// Confirm logout when the user clicks "Yes, Log Out"
confirmBtn.onclick = function() {
  // Clear session and localStorage data
  localStorage.removeItem("ID");  // Remove user session data from localStorage
  sessionStorage.clear();         // Clear all session data

  // Redirect to the login page and prevent back navigation
  window.location.href = "index.html";
  history.pushState(null, null, window.location.href);
  window.onpopstate = function(event) {
    history.go(1);
  };
};

// Check if the user is logged out (by checking sessionStorage or localStorage)
if (!sessionStorage.getItem("ID") && !localStorage.getItem("ID")) {
  // Ensure user cannot navigate back to the page after logout
  window.onpopstate = function(event) {
    history.go(1);
  };
}

// Prevent back navigation after logout
window.addEventListener("load", function() {
  window.history.forward();
});

// Prevent back navigation after logout
window.onunload = function() {
  null;
};

// Define the preventBack function
function preventBack() {
  window.history.forward();
}

// Call the preventBack function
setTimeout(preventBack, 0);
// Close the modal when clicking outside of it
window.onclick = function(event) {
  if (event.target === modal) {
    modal.style.display = "none";
  }
};