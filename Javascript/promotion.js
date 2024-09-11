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
  document.addEventListener('DOMContentLoaded', function () {
    var dropdown = document.querySelector('.dropdown-btn');
    var dropdownContent = document.querySelector('.dropdown-container');
    dropdown.addEventListener('click', function () {
      dropdownContent.classList.toggle('show');
    });
  });

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
  setNavEventListener("logout", 'index.html');
  setNavEventListener("reviews", 'reviews.html');
  setNavEventListener("otop", 'otop.html');
  setNavEventListener("localdishes", 'dishes.html');
  setNavEventListener("localindustries", 'industries.html');
  
  // CREATE FORM POPUP
  const createPromotion = document.getElementById('user-create');
  const openPop = document.querySelector('.add_acc');
  const closePop = document.querySelector('.close-modal');

  if (openPop && closePop && createPromotion) {
    openPop.addEventListener('click', () => {
      createPromotion.style.display = 'block';
    });
    closePop.addEventListener('click', () => {
      createPromotion.style.display = 'none';
    });
  }

  // FOR REGISTER FORM - ADD TO FIREBASE
  const formCreate = document.getElementById('create-form');
  const Name = document.getElementById('name');

  const Number = document.getElementById('number');
  const Email = document.getElementById('email');
  const Type = document.getElementById('type');
  const Address = document.getElementById('address');

  const photos = document.getElementById('photos');

  if (formCreate) {
    formCreate.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (validateInputs([ Name, Number, Email, Type, Address,  photos])) {
        try {
          const photoFile = photos.files[0];
          const photoRef = ref(storage, `hotels/${photoFile.name}`);
          await uploadBytes(photoRef, photoFile);
          const photoURL = await getDownloadURL(photoRef);

          await addDoc(collection(db, "vigan_establishments"), {
            Category: "Hotel",
            Name: Name.value,
           
            Number: Number.value,
            Email: Email.value,
            Type: Type.value,
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
    });
    cloPop.addEventListener('click', () => {
      editPromotion.style.display = 'none';
    });
  }

  // FOR EDIT FORM - UPDATE TO FIREBASE
  const formEdit = document.getElementById('edit-form');
  const Name1 = document.getElementById('name1');

  const Number1 = document.getElementById('number1');
  const Email1 = document.getElementById('email1');
  const Type1 = document.getElementById('type1');
  const Address1 = document.getElementById('address1');

  const photos1 = document.getElementById('photos1');

  if (formEdit) {
    formEdit.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (validateInputs([ Name1, , Number1, Email1, Type1, Address1, photos1])) {
        try {
          const userID = localStorage.getItem("ID");
          const photoFile = photos1.files[0];
          let photoURL;
          if (photoFile) {
            const photoRef = ref(storage, `hotels/${photoFile.name}`);
            await uploadBytes(photoRef, photoFile);
            photoURL = await getDownloadURL(photoRef);
          }

          const updateData = {
            Category: "Hotel",
            Name: Name1.value,
           
            Number: Number1.value,
            Email: Email1.value,
            Type: Type1.value,
            Address: Address1.value,
        
          };

          if (photoFile) {
            updateData.PhotoURL = photoURL;
          }

          await updateDoc(doc(db, "vigan_establishments", userID), updateData);
          editPromotion.style.display = 'none'; // Close the edit form
          window.location.reload(); // Reload to refresh the table
        } catch (error) {
          console.error("Error updating document: ", error);
        }
      }
      
    });
    
  }
// Additional event listeners and modal setups
  // Make sure these are correctly added and closed.
  
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
          <td>${doc.data().Number}</td>
             <td>${doc.data().Email}</td>
              <td>${doc.data().Type}</td>
            <td>${doc.data().Address}</td>
            <td><img src="${doc.data().PhotoURL}" alt="Event Photo" width="50" height="50"></td>
            <td><button id="gen_qr_${doc.id}" class="gen-qr-btn">Generate QR</button></td>
          `;
          tbody.appendChild(trow);

          trow.addEventListener('click', (e) => {
            localStorage.setItem('ID', doc.id);
            document.getElementById('name1').value = doc.data().Name;
            document.getElementById("type1").value = doc.data().Type;
            document.getElementById("email1").value = doc.data().Email;
            document.getElementById("number1").value = doc.data().Number;
            document.getElementById("address1").value = doc.data().Address;
            highlightRow(trow);
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
});


function highlightRow(row) {
  const rows = document.querySelectorAll('#tbody1 tr');
  rows.forEach(r => r.classList.remove('selected-row'));
  row.classList.add('selected-row');
  document.getElementById("edit_acc").disabled = false;
  document.getElementById("delete_acc").disabled = false;
} 

// Update event
document.getElementById('cnfrm_promo2').addEventListener('click', async () => {
  const userID = localStorage.getItem("ID");
  try {
    await updateDoc(doc(db, "vigan_establishments", userID), {
      // Update fields here
    });
    // Confirmation handling...
  } catch (error) {
    console.error("Error updating document: ", error);
  }
});

// Archive event instead of deleting
document.getElementById('delete_acc').addEventListener('click', async () => {
  const userID = localStorage.getItem("ID");
  try {
    await updateDoc(doc(db, "vigan_establishments", userID), {
      Status: "H Shop Closed",
      ArchivedBy: "ADMIN", // Replace with the actual admin's name if needed
      ArchivedDate: new Date().toISOString()
    });
    window.location.reload(); // Reload to refresh the table
  } catch (error) {
    console.error("Error updating document: ", error);
  }
});

// Button to see archived accounts
document.getElementById('promoArchive').addEventListener('click', () => {
  window.location = "pArchives.html";
});