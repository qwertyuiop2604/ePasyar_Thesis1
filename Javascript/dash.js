import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-firestore.js"


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


let profile = document.getElementById('profile')

profile.addEventListener('click', () =>{
  window.location = 'profile.html'
})

let users = document.getElementById("users");
users.addEventListener('click', () =>{
  window.location = 'profile.html'
})

let hotels = document.getElementById("hOtels");
hotels.addEventListener('click', () =>{
  window.location = 'promotion.html'
})

let resto = document.getElementById("resto");
resto.addEventListener('click', () =>{
  window.location = 'restaurants.html'
})


let events = document.getElementById('events')

events.addEventListener('click', () =>{
  window.location = 'events.html'
})

let dashboard = document.getElementById('dashboard')

dashboard.addEventListener('click', () =>{
  window.location = 'dash.html'
})

let promotion = document.getElementById("promotion");
promotion.addEventListener('click', () =>{
  window.location = 'promotion.html'
})
let tourist = document.getElementById("tourist");
tourist.addEventListener('click', () =>{
  window.location = 'tourist.html'
})
let souvenir = document.getElementById("souvenir");
souvenir.addEventListener('click', () =>{
  window.location = 'souvenir.html'
})

let restaurant = document.getElementById("restaurant");
restaurant.addEventListener('click', () =>{
  window.location = 'restaurants.html'
})

let logout = document.getElementById("logout");
logout.addEventListener('click', () =>{
  window.location = 'index.html'
})


let reviews = document.getElementById('reviews')

reviews.addEventListener('click', () =>{
  window.location = 'reviews.html'
})

