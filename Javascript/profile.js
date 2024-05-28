import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-app.js";
import { getFirestore, setDoc, doc, getDocs, updateDoc, collection } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-auth.js";

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
const auth = getAuth(app);

document.addEventListener('DOMContentLoaded', () => {
  // Navigation
  document.getElementById("dash").addEventListener('click', () => window.location = 'dash.html');
  document.getElementById("profile").addEventListener('click', () => window.location = 'profile.html');
  document.getElementById("events").addEventListener('click', () => window.location = 'events.html');
  document.getElementById("promotion").addEventListener('click', () => window.location = 'promotion.html');
  document.getElementById("tourist").addEventListener('click', () => window.location = 'tourist.html');
  document.getElementById("souvenir").addEventListener('click', () => window.location = 'souvenir.html');
  document.getElementById("restaurant").addEventListener('click', () => window.location = 'restaurants.html');
  document.getElementById("logout").addEventListener('click', () => window.location = 'index.html');

  // Create Account Form Popup
  const createAcc = document.getElementById('user-create');
  document.querySelector('.add_acc').addEventListener('click', () => createAcc.style.display = 'block');
  document.querySelector('.close-modal').addEventListener('click', () => createAcc.style.display = 'none');

  // Register Form - Add to Firebase
  const formCreate = document.getElementById('create-form');
  formCreate.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const pass = document.getElementById('password');
    const cpass = document.getElementById('confirm');

    if (name.value === '' || email.value === '' || pass.value === '' || cpass.value === '') {
      alert("All fields are required.");
    } else if (pass.value !== cpass.value) {
      alert("Passwords do not match.");
    } else {
      createUserWithEmailAndPassword(auth, email.value, pass.value)
        .then((userCredential) => {
          const user = userCredential.user;
          setDoc(doc(db, "users", "admin", "admin_account", user.uid), {
            name: name.value,
            email: email.value,
            password: pass.value,
            status: "Active"
          })
          .then(() => createAcc.style.display = 'none')
          .catch((error) => console.error("Error adding document: ", error));
        })
        .catch((error) => alert(error.message));
    }
  });

  // Edit Account Form Popup
  const editAcc = document.getElementById('user-edit');
  document.querySelector('.edit_acc').addEventListener('click', () => editAcc.style.display = 'block');
  document.querySelector('.close-modal-edit').addEventListener('click', () => editAcc.style.display = 'none');

  // Edit Form - Update to Firebase
  const formEdit = document.getElementById('edit-form');
  formEdit.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name1 = document.getElementById('name1');
    const email1 = document.getElementById('email1');
    const pass1 = document.getElementById('password1');
    const cpass1 = document.getElementById('confirm1');

    if (name1.value === '' || email1.value === '' || pass1.value === '' || cpass1.value === '') {
      alert("All fields are required.");
    } else if (pass1.value !== cpass1.value) {
      alert("Passwords do not match.");
    } else {
      const userId = localStorage.getItem('ID');
      if (userId) {
        const userRef = doc(db, "users", "admin", "admin_account", userId);
        updateDoc(userRef, {
          name: name1.value,
          email: email1.value,
          password: pass1.value
        })
        .then(() => {
          console.log("Document successfully updated!");
          editAcc.style.display = 'none';
        })
        .catch((error) => console.error("Error updating document: ", error));
      } else {
        console.error("No user ID found in localStorage");
      }
    }
  });

  // Populating table and setting up row click event
  const tbody = document.getElementById('tbody1');
  getDocs(collection(db, "users", "admin", "admin_account")).then(querySnapshot => {
    querySnapshot.forEach((doc) => {
      if (doc.data().status === "Active") {
        const trow = document.createElement('tr');
        const td1 = document.createElement('td');
        const td2 = document.createElement('td');
        const td3 = document.createElement('td');

        td1.textContent = doc.data().name;
        td2.textContent = doc.data().email;
        td3.textContent = doc.data().password;

        trow.appendChild(td1);
        trow.appendChild(td2);
        trow.appendChild(td3);

        tbody.appendChild(trow);

        trow.addEventListener('click', () => {
          localStorage.setItem('ID', doc.id);
          console.log(doc.id);

          document.querySelectorAll('tr').forEach(row => row.classList.remove('selected-row'));
          trow.classList.add('selected-row');

          document.getElementById("edit_acc").disabled = false;
          document.getElementById("delete_acc").disabled = false;

          document.getElementById('name1').value = doc.data().name;
          document.getElementById('email1').value = doc.data().email;
          document.getElementById('password1').value = doc.data().password;
        });
      }
    });
  });

  const currentDateTime = new Date().toLocaleString();

  // Event Listener for delete account button
  document.getElementById('delete_acc').addEventListener('click', () => {
    document.getElementById('delete_acc_modal').style.display = "block";
  });

  // Confirm delete account
  document.getElementById('confirm_delete').addEventListener('click', async () => {
    const userId = localStorage.getItem('ID');
    if (userId) {
      const userRef = doc(db, "users", "admin", "admin_account", userId);
      await updateDoc(userRef, {
        status: "Deleted",
        deletedBy: "ADMIN",
        deletedDate: currentDateTime
      })
      .then(() => {
        console.log("Document successfully updated to Deleted!");
        document.getElementById('delete_acc_modal').style.display = "none";
        window.location.reload(); // Reload the page to reflect changes
      })
      .catch((error) => console.error("Error updating document: ", error));
    } else {
      console.error("No user ID found in localStorage");
    }
  });

  // Cancel delete account
  document.getElementById('cancel_delete').addEventListener('click', () => {
    document.getElementById('delete_acc_modal').style.display = "none";
  });

  // Button to see archived accounts
  document.getElementById('archived_acc').addEventListener('click', () => {
    window.location = "prArchives.html";
  });

  // Password visibility toggle functions
  document.getElementById('icon1').addEventListener('click', showPwrd1);
  document.getElementById('icon2').addEventListener('click', showPwrd2);
  document.getElementById('icon3').addEventListener('click', showPwrd3);
  document.getElementById('icon4').addEventListener('click', showPwrd4);

  function showPwrd1() {
    const passInput = document.getElementById("password");
    const icon1 = document.getElementById("icon1");

    if (passInput.type === "password") {
      passInput.type = "text";
      icon1.innerText = "visibility_off";
    } else {
      passInput.type = "password";
      icon1.innerText = "visibility";
    }
  }

  function showPwrd2() {
    const confirmPass = document.getElementById("confirm");
    const icon2 = document.getElementById("icon2");

    if (confirmPass.type === "password") {
      confirmPass.type = "text";
      icon2.innerText = "visibility_off";
    } else {
      confirmPass.type = "password";
      icon2.innerText = "visibility";
    }
  }

  function showPwrd3() {
    const pass = document.getElementById("password1");
    const icon3 = document.getElementById("icon3");

    if (pass.type === "password") {
      pass.type = "text";
      icon3.innerText = "visibility_off";
    } else {
      pass.type = "password";
      icon3.innerText = "visibility";
    }
  }

  function showPwrd4() {
    const cpass = document.getElementById("confirm1");
    const icon4 = document.getElementById("icon4");

    if (cpass.type === "password") {
      cpass.type = "text";
      icon4.innerText = "visibility_off";
    } else {
      cpass.type = "password";
      icon4.innerText = "visibility";
    }
  }

  // Search functionality
  document.getElementById('srchText').addEventListener('input', searchAppID);

  function searchAppID() {
    let filter = document.getElementById('srchText').value.toUpperCase(); // convert to uppercase for case-insensitive search
    let mytable = document.getElementById('tbody1');
    let tr = mytable.getElementsByTagName('tr');

    for (let i = 0; i < tr.length; i++) {
      let td = tr[i].getElementsByTagName('td')[0];
      let td2 = tr[i].getElementsByTagName('td')[1];
      let td3 = tr[i].getElementsByTagName('td')[2];

      if (td && td2 && td3) { // check if all td elements exist
        let textvalue = td.textContent.toUpperCase() || td.innerHTML; // convert to uppercase for case-insensitive search
        let textvalue2 = td2.textContent.toUpperCase() || td2.innerHTML;
        let textvalue3 = td3.textContent.toUpperCase() || td3.innerHTML;

        if (textvalue.indexOf(filter) > -1 || textvalue2.indexOf(filter) > -1 || textvalue3.indexOf(filter) > -1) {
          tr[i].style.display = '';
        } else {
          tr[i].style.display = 'none';
        }
      }
    }
  }
});
