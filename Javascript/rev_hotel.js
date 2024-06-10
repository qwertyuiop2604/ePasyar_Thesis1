import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-firestore.js";

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

document.addEventListener('DOMContentLoaded', async () => {
  const tbody = document.getElementById('tbody1');

  // Fetch user data
  const usersSnapshot = await getDocs(collection(db, "users"));
  const usersMap = new Map();

  usersSnapshot.forEach(doc => {
    const data = doc.data();
    usersMap.set(data.email);
  });

  // Fetch review data
  const reviewsSnapshot = await getDocs(collection(db, "ratings", "Hotel", "Hotel_reviews" ));

  reviewsSnapshot.forEach(doc => {
    const data = doc.data();

    const trow = document.createElement('tr');
    trow.innerHTML = 
    `
      <td>${usersMap.get(data.email) || data.email}</td>
      <td>${data.review_text}</td>
      <td>${data.rating}</td>
      <td>${data.timestamp}</td>
    `;
    tbody.appendChild(trow);
  });
});
