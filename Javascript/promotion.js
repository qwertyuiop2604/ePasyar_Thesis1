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

  async function populateTable() {
    const tbody = document.getElementById('tbody1');
    if (tbody) {
      tbody.innerHTML = ''; // Clear existing rows
      const querySnapshot = await getDocs(collection(db, "vigan_establishments"));
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
             <td><button id="gen_qr_${doc.id}" class="gen-qr-btn" accept="image/png, image/jpeg">Generate QR</button></td>
          `;
          tbody.appendChild(trow);
  
          trow.addEventListener('click', (e) => {
            localStorage.setItem('ID', doc.id);
            Name1.value = doc.data().Name;
          
            Number1.value = doc.data().Number;
            Email1.value = doc.data().Email;
            Type1.value = doc.data().Type;
           
   
            
            highlightRow(trow);
          });  
          // Generate and download QR code when clicking on Generate QR button
           document.getElementById(`gen_qr_${doc.id}`).addEventListener("click", (e) => {
            e.stopPropagation(); // Prevent click from propagating to row click event
            generateAndDownloadQRCode(doc.data().Name, doc.id);
          });
        }
         
      });
    }
  }
  
  populateTable();
});
function generateAndDownloadQRCode(establishmentName, documentId) {
  // Create a new QRCode instance
  const qrCodeContainer = document.createElement('div');
  const qrCode = new QRCode(qrCodeContainer, {
    text: documentId, // Pass the document ID directly
    width: 700,
    height: 700,
    colorDark: "#000000", // Dark color
    colorLight: "#ffffff", // Light color
  });

  // Get the QR code data URL after it's been generated
  setTimeout(() => {
    const qrImageData = qrCodeContainer.querySelector('img').src;

    // Create a temporary link element to download the QR code
    const downloadLink = document.createElement('a');
    downloadLink.href = qrImageData;
    downloadLink.download = `qr_${establishmentName}.png`;
    downloadLink.click();
  }, 1000); // Wait for QR code to be generated
}


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