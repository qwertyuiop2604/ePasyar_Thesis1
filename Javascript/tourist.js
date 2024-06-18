
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-app.js";
import {
  getFirestore,
  addDoc,
  doc,
  collection,
  getDocs,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/9.1.1/firebase-firestore.js";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
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
  let logout = document.getElementById("logout");

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
  if (logout)
    logout.addEventListener("click", () => (window.location = "index.html"));

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
});

document.addEventListener("DOMContentLoaded", async function () {
  var dropdown = document.querySelector(".dropdown-btn");
  var dropdownContent = document.querySelector(".dropdown-container");
  dropdown.addEventListener("click", function () {
    dropdownContent.classList.toggle("show");
  });

  // CREATE FORM POPUP
  const createAcc = document.getElementById("user-create");
  const openPop = document.querySelector(".add_acc");
  const closePop = document.querySelector(".close-modal");

  if (openPop)
    openPop.addEventListener(
      "click",
      () => (createAcc.style.display = "block")
    );
  if (closePop)
    closePop.addEventListener(
      "click",
      () => (createAcc.style.display = "none")
    );

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
  
    if (oPop)
      oPop.addEventListener("click", () => (editAcc.style.display = "block"));
    if (cPop)
      cPop.addEventListener("click", () => (editAcc.style.display = "none"));
  
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
  
    // Populate table with data
    const tbody = document.getElementById("tbody1");
    const querySnapshot = await getDocs(collection(db, "vigan_establishments"));
    querySnapshot.forEach((doc) => {
      if (doc.data().Status === "TS Shop Open") {
        const trow = document.createElement("tr");
        trow.innerHTML = `
          <td>${doc.data().Name}</td>
          <td>${doc.data().Description}</td>
          <td>${doc.data().Location}</td>
          <td><img src="${doc.data().PhotoURL}" alt="Event Photo" width="50" height="50"></td>
          <td><button id="gen_qr_${doc.id}" class="gen-qr-btn" accept="image/png, image/jpeg">Generate QR</button></td>
        `;
        tbody.appendChild(trow);
        
  
        trow.addEventListener("click", (e) => {
          localStorage.setItem("ID", doc.id);
          document.getElementById("name1").value = doc.data().Name;
          document.getElementById("description1").value = doc.data().Description;
          document.getElementById("location1").value = doc.data().Location;
          highlightRow(trow);
        });
  
        // Generate and download QR code when clicking on Generate QR button
        document.getElementById(`gen_qr_${doc.id}`).addEventListener("click", (e) => {
          e.stopPropagation(); // Prevent click from propagating to row click event
          generateAndDownloadQRCode(doc.data().Name, doc.id);
        });
      }
    });
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