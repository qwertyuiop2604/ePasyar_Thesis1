import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-app.js";
import { getFirestore, addDoc, doc, collection, setDoc, getDocs, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-storage.js";


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


  document.addEventListener('DOMContentLoaded', () => {
    function setNavEventListener(id, target) {
      const element = document.getElementById(id);
      if (element) {
        element.addEventListener('click', () => {
          window.location = target;
        });
      }
    }
  function setNavEventListener(id, target) {
    const element = document.getElementById(id);
    if (element) {
      element.addEventListener('click', () => {
        window.location = target;
      });
    }
  }

  setNavEventListener("dash", 'dash.html');
  setNavEventListener("profile", 'profile.html');
  setNavEventListener("events", 'events.html');
  setNavEventListener("tourist", 'tourist.html');
  setNavEventListener("souvenir", 'souvenir.html');
  setNavEventListener("restaurant", 'restaurants.html');
  setNavEventListener("reviews", 'reviews.html');
  setNavEventListener("otop", 'otop.html');
  setNavEventListener("localdishes", 'dishes.html');
  setNavEventListener("localindustries", 'industries.html');

  let rewards = document.getElementById("reward");
  rewards.addEventListener("click", () => {
    window.location = "redeem.html";
  });
  let graph = document.getElementById("graph");
graph.addEventListener("click", () => {
  window.location = "table.html";
});
  // CREATE FORM POPUP
  const createPromotion = document.getElementById('user-create');
  const openPop = document.querySelector('.add_acc');
  const closePop = document.querySelector('.close-modal');

  if (openPop && closePop && createPromotion) {
    openPop.addEventListener('click', () => {
      createPromotion.style.display = 'block';
      toggleBlur(true);
    });
    closePop.addEventListener('click', () => {
      createPromotion.style.display = 'none';
      toggleBlur(false);
    });
  }

  const formCreate = document.getElementById('create-form');
  const Name = document.getElementById('name');
  const Number = document.getElementById('number');
  const Email = document.getElementById('email');
  const Address = document.getElementById('address');
  const photos = document.getElementById('photos');
  const category = document.getElementById('category');  // Category reference
  
  if (formCreate) {
    formCreate.addEventListener('submit', async (e) => {
      e.preventDefault();
  
      // Ensure all fields are filled in, including category
      if (validateInputs([Name, Number, Email, Address, photos, category])) {
        try {
          const photoFile = photos.files[0];
          const photoRef = ref(storage, `hotels/${photoFile.name}`);
          await uploadBytes(photoRef, photoFile);
          const photoURL = await getDownloadURL(photoRef);
  
          await addDoc(collection(db, "vigan_establishments"), {
            Category: category.value,  // Save selected category
            Name: Name.value,
            Number: Number.value,
            Email: Email.value,
            Address: Address.value,
            PhotoURL: photoURL,
            Status: "H Shop Open"
          });
  
          createPromotion.style.display = 'none';
          window.location.reload(); // Reload to refresh the table
        } catch (error) {
          console.error("Error adding document: ", error);
        }
      }
    });
  }
  

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

  // For edit modal confirmation
  const confirmationPromo = document.getElementById('cnfrm_edit');
  const cancelPromo = document.getElementById('cnl_promo');
  const confirmPromo = document.getElementById('cnfrm_promo');

  if (cancelPromo && confirmationPromo && confirmPromo) {
    cancelPromo.addEventListener('click', () => {
      confirmationPromo.style.display = 'none';
      modalEditPromo.style.display = 'block';
      confirmPromo.style.display = 'none';
    });
  }

  // EDIT FORM POPUP
  const editPromotion = document.getElementById('user-edit');
  const opPop = document.querySelector('.edit_acc');
  const cloPop = document.querySelector('.close-modal-edit');

  if (opPop && cloPop && editPromotion) {
    opPop.addEventListener('click', () => {
      editPromotion.style.display = 'block';
      toggleBlur(true); 
    });
    cloPop.addEventListener('click', () => {
      editPromotion.style.display = 'none';
      toggleBlur(false);
    });
  }

  const formEdit = document.getElementById('edit-form');
const Name1 = document.getElementById('name1');
const Number1 = document.getElementById('number1');
const Email1 = document.getElementById('email1');
const Address1 = document.getElementById('address1');
const photos1 = document.getElementById('photos1');
const category1 = document.getElementById('category1');  // Add category1 reference

if (formEdit) {
  formEdit.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Ensure all fields are filled in, including category
    if (validateInputs([Name1, Number1, Email1, Address1, photos1, category1])) {
      try {
        const userID = localStorage.getItem("ID");
        const photoFile = photos1.files[0];
        let photoURL;

        if (photoFile) {
          const photoRef = ref(storage, `hotels/${photoFile.name}`);
          await uploadBytes(photoRef, photoFile);
          photoURL = await getDownloadURL(photoRef);
        }

        // Prepare data for updating, including the selected category
        const updateData = {
          Category: category1.value,  // Add the selected category here
          Name: Name1.value,
          Number: Number1.value,
          Email: Email1.value,
          Address: Address1.value,
        };

        // If there's a photo, add its URL to the update data
        if (photoFile) {
          updateData.PhotoURL = photoURL;
        }

        // Update the document in Firestore
        await updateDoc(doc(db, "vigan_establishments", userID), updateData);

        editPromotion.style.display = 'none'; // Close the edit form
        window.location.reload(); // Reload to refresh the table
      } catch (error) {
        console.error("Error updating document: ", error);
      }
    }
  });
}

  
// Fetch documents from Firestore and assign to querySnapshot
async function fetchEstablishments() {
  try {
    const querySnapshot = await getDocs(collection(db, "vigan_establishments"));
    const tbody = document.getElementById('tbody1');

    querySnapshot.forEach(doc => {
      if (doc.data().Status === "H Shop Open") {
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
          document.getElementById("category1").value = doc.data().Category; 
          document.getElementById('name1').value = doc.data().Name;
          document.getElementById("email1").value = doc.data().Email;
          document.getElementById("number1").value = doc.data().Number;
          document.getElementById("address1").value = doc.data().Address;
          // Set the category in the edit form
          highlightRow(trow);
        });

        const detailsBtn = document.getElementById(`details_${doc.id}`);
        detailsBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            showDetailsModal(doc.data());
        });

        function showDetailsModal(data) {
          document.getElementById("details-category").textContent = data.Category; // Add Category to modal
          document.getElementById("details-name").textContent = data.Name;
          document.getElementById("details-number").textContent = data.Number;
          document.getElementById("details-email").textContent = data.Email;
          document.getElementById("details-address").textContent = data.Address;
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
              toggledBlur(false);   // Remove blur effect when clicking outside of the modal
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
  window.location.href = `rev_hotel.html?docId=${doc.id}`;
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

  

});


function highlightRow(row) {
  const rows = document.querySelectorAll('#tbody1 tr');
  rows.forEach(r => r.classList.remove('selected-row'));
  row.classList.add('selected-row');
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
// Button to see archived accounts
document.getElementById('promoArchive').addEventListener('click', () => {
  window.location = "pArchives.html";
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
      Status: "H Shop Closed",
      ArchivedBy: "ADMIN", // Replace with the actual admin's name if needed
 ArchivedDate: new Date().toLocaleString()
    }).then(() => {
      window.location = "archives.html";
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
 