import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-app.js";
import { getFirestore, addDoc, doc, collection, getDocs, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-storage.js";

// Firebase configuration
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

document.addEventListener('DOMContentLoaded', async () => {
  // Event listeners for navigation
  let dash = document.getElementById("dash");
  dash.addEventListener('click', () => {
    window.location = 'dash.html';
  });
  let profile = document.getElementById("profile");
  profile.addEventListener('click', () => {
    window.location = 'profile.html';
  });
  let promotion = document.getElementById("promotion");
  promotion.addEventListener('click', () => {
    window.location = 'promotion.html';
  });
  let tourist = document.getElementById("tourist");
  tourist.addEventListener('click', () => {
    window.location = 'tourist.html';
  });
  let souvenir = document.getElementById("souvenir");
  souvenir.addEventListener('click', () => {
    window.location = 'souvenir.html';
  });
  let logout = document.getElementById("logout");
  logout.addEventListener('click', () => {
    window.location = 'index.html';
  });

  // CREATE FORM POPUP
  const createAcc = document.getElementById('user-create');
  const openPop = document.querySelector('.add_acc');
  const closePop = document.querySelector('.close-modal');

  openPop.addEventListener('click', () => {
    createAcc.style.display = 'block';
  });
  closePop.addEventListener('click', () => {
    createAcc.style.display = 'none';
  });

  // Adding event
  document.getElementById("create-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    let Name = document.getElementById("name").value;
    let Date = document.getElementById("date").value;
    let Description = document.getElementById("description").value;
    let photos = document.getElementById("photos").files;

    // Upload photo to storage and get URL
    let photoURL = "";
    if (photos.length > 0) {
      const storageRef = ref(storage, `events/${photos[0].name}`);
      await uploadBytes(storageRef, photos[0]);
      photoURL = await getDownloadURL(storageRef);
    }

    await addDoc(collection(db, "festivals"), {
      Name,
      Date,
      Description,
      photoURL
    });

    // Reset the form
    document.getElementById("create-form").reset();

    alert("Event added successfully!");
    fetchEvents();
  });

  // Fetch and display events
  async function fetchEvents() {
    const querySnapshot = await getDocs(collection(db, "festivals"));
    let tbody = document.getElementById("tbody1");
    tbody.innerHTML = "";

    querySnapshot.forEach((doc) => {
      let data = doc.data();
      let tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${data.Name}</td>
        <td>${data.Date}</td>
        <td>${data.Description}</td>
        <td><img src="${data.photoURL}" alt="Event Photo" width="100"></td>
      `;
      tbody.appendChild(tr);

      tr.addEventListener('click', () => {
        localStorage.setItem('ID', doc.id);
        highlightRow(tr, doc);
      });
    });
  }

  // Function to highlight the selected row
  function highlightRow(selectedRow, doc) {
    const table = document.getElementById("table");
    const rows = table.getElementsByTagName('tr');
    for (let i = 0; i < rows.length; i++) {
      rows[i].classList.remove('selected-row');
    }

    selectedRow.classList.add('selected-row');
    document.getElementById("edit_acc").disabled = false;
    document.getElementById("delete_acc").disabled = false;

    document.getElementById('name1').value = doc.data().Name;
    document.getElementById('date1').value = doc.data().Date;
    document.getElementById('description1').value = doc.data().Description;
    document.getElementById("edit-form").dataset.id = doc.id; // Set the ID for editing
    document.getElementById("delete-form").dataset.id = doc.id; // Set the ID for deleting
  }

  fetchEvents();

  // FOR EDIT MODAL CONFIRMATION - FINAL
  const confirmation = document.getElementById('cnfrm_edit');
  const cancel = document.querySelector('.cnl');
  const confirm = document.querySelector('.cnfrm');

  cancel.addEventListener('click', () => {
    confirmation.style.display = 'none';
    modalEdit.style.display = 'block';
    confirm.style.display = 'none';
  });

  // Edit FORM POPUP
  const editAcc = document.getElementById('user-edit');
  const oPop = document.querySelector('.edit_acc');
  const cPop = document.querySelector('.close-modal-edit');

  oPop.addEventListener('click', () => {
    editAcc.style.display = 'block';
  });
  cPop.addEventListener('click', () => {
    editAcc.style.display = 'none';
  });

  // Event listener for the edit form
  document.getElementById("edit-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    let id = document.getElementById("edit-form").dataset.id;
    let Name = document.getElementById("name1").value;
    let Date = document.getElementById("date1").value;
    let Description = document.getElementById("description1").value;
    let photos = document.getElementById("photos1").files;

    let photoURL = "";
    if (photos.length > 0) {
      const storageRef = ref(storage, `events/${photos[0].name}`);
      await uploadBytes(storageRef, photos[0]);
      photoURL = await getDownloadURL(storageRef);
    }

    await updateDoc(doc(db, "festivals", id), {
      Name,
      Date,
      Description,
      photoURL
    });

    alert("Event updated successfully!");
    fetchEvents();
    editAcc.style.display = 'none';
  });

  // Event listener for delete
  document.getElementById("delete-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    let id = document.getElementById("delete-form").dataset.id;
    await deleteDoc(doc(db, "festivals"));

    alert("Event deleted successfully!");
    fetchEvents();
    document.getElementById("edit_acc").disabled = true;
    document.getElementById("delete_acc").disabled = true;
  });

  // Additional code for handling confirmation modals and updates
  const currentDateTime = new Date().toLocaleString();
  const querySnapshot2 = await getDocs(collection(db, "festivals"));

  querySnapshot2.forEach(doc2 => {
    confirm.addEventListener('click', async () => {
      const updateEvents = doc(db, "festivals", doc2.id);
      var userID = localStorage.getItem("ID");

      if (userID === doc2.id) {
        await updateDoc(updateEvents, {
          Name: document.getElementById("name1").value,
          Date: document.getElementById("date1").value,
          Description: document.getElementById("description1").value
        });
        confirmation.style.display = 'none';
        fetchEvents();
      }
    });

    // Event listener for delete confirmation
    confirm.addEventListener('click', async () => {
      const id = localStorage.getItem('ID');
      if (!id) return;

      const updateEvents = doc(db, "festivals", id);
      await updateDoc(updateEvents, {
        Status: "done",
        DeletedBy: "ADMIN",
        DeletedDate: currentDateTime
      });
      alert('Document successfully deleted!');
      confirmation.style.display = 'none';
      localStorage.removeItem("ID");
      fetchEvents();
    });
  });
});

//Button to see archived accounts
archived_acc.addEventListener("click", (e) => {
  window.location = "archives.html";
});

