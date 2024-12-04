import { 
  initializeApp 
} from "https://www.gstatic.com/firebasejs/9.1.1/firebase-app.js";

import { 
  getFirestore, 
  addDoc, 
  doc, 
  collection, 
  getDocs, 
  updateDoc, 
  getDoc  // Include getDoc here
} from "https://www.gstatic.com/firebasejs/9.1.1/firebase-firestore.js";

import { 
  getStorage, 
  ref, 
  uploadBytes, 
  getDownloadURL 
} from "https://www.gstatic.com/firebasejs/9.1.1/firebase-storage.js";

// Ensure you include the QRCode library in your HTML file
// <script src="https://cdn.jsdelivr.net/npm/qrcodejs/qrcode.min.js"></script>

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

document.addEventListener("DOMContentLoaded", async () => {
  let dash = document.getElementById("dash");
  let profile = document.getElementById("profile");
  let promotion = document.getElementById("promotion");
  let events = document.getElementById("events");
  let souvenir = document.getElementById("souvenir");
  let restaurant = document.getElementById("restaurant");


  if (dash)
    dash.addEventListener("click", () => (window.location = "dash.html"));
  if (profile)
    profile.addEventListener("click", () => (window.location = "profile.html"));
  if (promotion)
    promotion.addEventListener(
      "click",
      () => (window.location = "promotion.html")
    );
  if (events)
    events.addEventListener("click", () => (window.location = "events.html"));
  if (souvenir)
    souvenir.addEventListener(
      "click",
      () => (window.location = "souvenir.html")
    );
  if (restaurant)
    restaurant.addEventListener(
      "click",
      () => (window.location = "restaurants.html")
    );
 
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
  
let activities = document.getElementById("activities");

activities.addEventListener("click", () => {
  window.location = "activities.html";
});
let user = document.getElementById("user");

user.addEventListener("click", () => {
  window.location = "user.html";
});
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
  const location = document.getElementById("location");
  const description = document.getElementById("description");
  const photos = document.getElementById("photos");

  formCreate.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (validateInputs([name, location, description, photos])) {
      try {
        const photoFile = photos.files[0];
        const photoRef = ref(storage, `tourist/${photoFile.name}`);
        await uploadBytes(photoRef, photoFile);
        const photoURL = await getDownloadURL(photoRef);

        await addDoc(collection(db, "vigan_establishments"), {
          Category: "Tourist Spot",
          Name: name.value,
          Description: description.value.trim(),
          Location: location.value,
          PhotoURL: photoURL,
          Status: "TS Shop Open",
        });
        createAcc.style.display = "none";
        window.location.reload(); // Reload to refresh the table
      } catch (error) {
        console.error("Error adding document: ", error);
      }
    }
  });

  function validateInputs(inputs) {
    let isValid = true;
    inputs.forEach((input) => {
      if (input.value.trim() === "") {
        input.classList.add("invalid-input");
        isValid = false;
      } else {
        input.classList.remove("invalid-input");
        input.classList.add("valid-input");
      }
    });
    return isValid;
  }

  // Edit FORM POPUP
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
    const description1 = document.getElementById("description1");
    const location1 = document.getElementById("location1");
    const photos1 = document.getElementById("photos1");
  
    formEdit.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (validateInputs([name1, description1, photos1])) {
        try {
          const userID = localStorage.getItem("ID");
          const photoFile = photos1.files[0];
          let photoURL;
          if (photoFile) {
            const photoRef = ref(storage, `tourist/${photoFile.name}`);
            await uploadBytes(photoRef, photoFile);
            photoURL = await getDownloadURL(photoRef);
          }
  
          const updateData = {
            Category: "Tourist Spot",
            Name: name1.value,
            Description: description1.value,
            Location: location1.value,
          };
  
          if (photoFile) {
            updateData.PhotoURL = photoURL;
          }
  
          await updateDoc(doc(db, "vigan_establishments", userID), updateData);
          editAcc.style.display = "none"; // Close the edit form
          window.location.reload(); // Reload to refresh the table
        } catch (error) {
          console.error("Error updating document: ", error);
        }
      }
      
    });
    // Function to limit the description to 1000 words
function limitWords(textareaId, maxWords) {
  const textarea = document.getElementById(textareaId);
  const wordCountMessage = document.createElement('div');
  wordCountMessage.style.color = 'yellow';
  textarea.parentNode.insertBefore(wordCountMessage, textarea.nextSibling);

  textarea.addEventListener('input', function () {
    let words = textarea.value.split(/\s+/).filter(word => word.length > 0);
    if (words.length > maxWords) {
      textarea.value = words.slice(0, maxWords).join(' ');
      words = words.slice(0, maxWords);
    }
    wordCountMessage.textContent = `Word Count: ${words.length}/${maxWords}`;
  });
}

// Apply the word limit to both add and edit forms
limitWords('description', 100);
limitWords('description1', 100);

function toggleBlur(shouldBlur) {
  const container = document.querySelector('.main-container'); // Select the common container
  if (shouldBlur) {
    container.classList.add('blur-background');
  } else {
    container.classList.remove('blur-background');
  }
}

  
  // Fetch documents from Firestore and assign to querySnapshot
  async function fetchEstablishments() {
    try {
      const querySnapshot = await getDocs(collection(db, "vigan_establishments"));
      const tbody = document.getElementById('tbody1');
  
      querySnapshot.forEach(doc => {
        if (doc.data().Status === "TS Shop Open") {
          const trow = document.createElement('tr');
          trow.innerHTML = `
            <td>${doc.data().Name}</td>
         
         <td><button id="details_${doc.id}" class="details-btn">Show Details</button></td> <!-- Show Details Button -->
            <td><button id="gen_qr_${doc.id}" class="gen-qr-btn">Generate QR</button></td>
             <td><button id="reviews_${doc.id}" class="reviews-btn">See Reviews</button></td> <!-- See Reviews Button -->
           
          </td>
          `;
          tbody.appendChild(trow);

          trow.addEventListener('click', (e) => {
            localStorage.setItem('ID', doc.id);
            document.getElementById('name1').value = doc.data().Name;
            document.getElementById("description1").value = doc.data().Description;
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
            document.getElementById("details-description").textContent = data.Description;
            document.getElementById("details-location").textContent = data.Location;
            document.getElementById("details-photo").src = data.PhotoURL || "default_image_url_here"; // Add a default image URL if PhotoURL is not available
        
            const modal = document.getElementById("details-modal");
            modal.style.display = "block";
        
            const closeBtn = modal.querySelector(".details-close");
            closeBtn.onclick = () => {
                modal.style.display = "none";
            };
        
            // Close modal when clicking outside of it
            window.onclick = function (event) {
                if (event.target === modal) {
                    modal.style.display = "none";
                }
            };
        }
        
        const seeReviewsBtn = document.getElementById(`reviews_${doc.id}`);
        seeReviewsBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          showReviewsModal(doc.id); // Ensure correct doc.id is being passed
        });
// Function to show the modal and fetch reviews
function showReviewsModal(documentId) {
  const reviewsModal = document.getElementById("reviews-modal");
  reviewsModal.style.display = "block";
  fetchReviews(documentId); // Fetch reviews for the specific establishment
}

// Event listener to close the modal
document.getElementById("close-modal").addEventListener("click", () => {
  document.getElementById("reviews-modal").style.display = "none";
});

// Function to fetch and display reviews
async function fetchReviews(documentId) {
  const reviewsContainer = document.getElementById("reviews-container");
  reviewsContainer.innerHTML = "<p>Loading reviews...</p>"; // Loading state message

  // Define the path to the reviews collection for the specific establishment
  const reviewsCollectionRef = collection(db, `/ratings/Tourist Spot/Tourist Spot_reviews/${documentId}/reviews`); // Fetch from subcollection

  try {
    const snapshot = await getDocs(reviewsCollectionRef);

    if (snapshot.empty) {
      reviewsContainer.innerHTML = "<p>No reviews yet.</p>";
    } else {
      reviewsContainer.innerHTML = ""; // Clear the loading message
      snapshot.forEach((doc) => {
        const reviewData = doc.data();
        const reviewElement = document.createElement("div");
        reviewElement.className = "review-item";
        reviewElement.innerHTML = `
          <h4>Rating 1: ${reviewData.average_rating1}</h4>
          <h4>Rating 2: ${reviewData.average_rating2}</h4>
          <h4>Rating 3: ${reviewData.average_rating3}</h4>
          <h4>Name: ${reviewData.name}</h4>
          <h4>Total Reviews: ${reviewData.total_reviews}</h4>
        `;
        reviewsContainer.appendChild(reviewElement); // Append each review to the container
      });
    }
  } catch (error) {
    console.error("Error fetching reviews:", error);
    reviewsContainer.innerHTML = "<p>Error fetching reviews.</p>";
  }
}


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

  

  // Other event listeners and functions...

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

// Archive event instead of deleting
const currentDateTime = new Date().toLocaleString();
document.getElementById("delete_acc").addEventListener("click", async () => {
  const userID = localStorage.getItem("ID");
  try {
    await updateDoc(doc(db, "vigan_establishments", userID), {
      Status: "TS Shop Closed",
      ArchivedBy: "ADMIN", // Replace with the actual admin's name if needed
      ArchivedDate: currentDateTime,
    });
    window.location.reload(); // Reload to refresh the table
  } catch (error) {
    console.error("Error updating document: ", error);
  }
});

// Button to see archived accounts
document.getElementById("archived_acc").addEventListener("click", () => {
  window.location = "tArchives.html";
});


let logoutModal = document.getElementById("logout");
let modal = document.getElementById("logoutModal");
let closeBtn = document.getElementsByClassName("close")[0];
let confirmBtn = document.getElementById("confirmLogout");
let cancelBtn = document.getElementById("cancelLogout");

logout.addEventListener("click", (event) => {
  event.preventDefault(); // Prevent default link behavior
  modal.style.display = "block"; // Show the modal
});

closeBtn.onclick = function() {
  modal.style.display = "none"; // Hide the modal when the close button is clicked
};

cancelBtn.onclick = function() {
  modal.style.display = "none"; // Hide the modal when cancel button is clicked
};

confirmBtn.onclick = function() {
  window.location = "index.html"; // Redirect to index.html on confirmation
};

// Close the modal when clicking outside of it
window.onclick = function(event) {
  if (event.target === modal) {
    modal.style.display = "none";
  }
};
 