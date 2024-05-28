import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getFirestore,collection, getDocs, updateDoc, doc, setDoc  } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";



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


// Function to populate the table with archived users
async function seeArchives() {
  const tbody = document.getElementById('tbody1');
  tbody.innerHTML = ''; // Clear existing rows
  const querySnapshot = await getDocs(collection(db, "users", "admin", "admin_account"));
  querySnapshot.forEach((doc) => {
    if (doc.data().status === "Deleted") {
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
}

// Event listener for the "See Archives" button
document.getElementById("see_archives").addEventListener('click', seeArchives);

// Event listener for the "Back" button
document.getElementById("back_button").addEventListener('click', () => {
  window.location = 'profile.html';
});
