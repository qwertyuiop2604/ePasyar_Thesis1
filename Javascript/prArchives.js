
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

let bckbtn = document.getElementById("bckbtn");
bckbtn.addEventListener('click', () => {
    window.location = 'profile.html'
})
let events = document.getElementById("events");
events.addEventListener('click', () => {
    window.location = 'events.html'
})
let souvenir = document.getElementById("souvenir");
souvenir.addEventListener('click', () =>{
  window.location = 'souvenir.html'
})
let logout = document.getElementById("logout");
logout.addEventListener('click', () =>{
  window.location = 'index.html'
})
let reviews = document.getElementById("reviews");
reviews.addEventListener("click", () => {
  window.location = "reviews.html";
});

// FINAL
var tbody = document.getElementById('tbody1');

const querySnapshot = await getDocs(collection(db, "users", "admin", "admin_account"));
  querySnapshot.forEach(doc => {

    if(doc.data().Status == "Not Available"){
      var trow = document.createElement('tr');
      let td1 = document.createElement('td');
      let td2 = document.createElement('td');
      let td3 = document.createElement('td');
      let td4 = document.createElement('td');
      let td5 = document.createElement('td');

      
    
     
      td1.innerHTML = doc.data().Name;
      td2.innerHTML = doc.data().Email;
      td3.innerHTML = doc.data().Password;
      td4.innerHTML = doc.data().DeletedBy;
      td5.innerHTML = doc.data().DeletedDate;
      
  
      trow.appendChild(td1);
      trow.appendChild(td2);
      trow.appendChild(td3);
      trow.appendChild(td4);
      trow.appendChild(td5);
     
  
      tbody.appendChild(trow);

      trow.addEventListener('click', (e) =>{

        localStorage.setItem('ID', doc.id)
        //console.log(doc.id)

        //HIGHLIGHT TABLE ROW WHEN CLICKED - FINAL
        var table = document.getElementById("table");
        var rows = document.getElementsByTagName('tr');
        for( let i = 1; i < rows.length; i++){
          var currentRow = table.rows[i];
          currentRow.onclick = function(){
            Array.from(this.parentElement.children).forEach(function(el){
              el.classList.remove('selected-row');
              
            });

            // [...this.parentElement.children].forEach((el) => el.classList.remove('selected-row'));
            this.classList.add('selected-row');

                document.getElementById("enabledbtn").disabled = false;

                
        }
        
      }
    });

    }
  });

 
    

// window.onload = GetAllDataOnce;

document.getElementById("enabledbtn").disabled = true; 

enabledbtn.addEventListener('click', () => {
  document.getElementById('cnfrm_modal_enable').style.display = "block";
});

cnl_promo3.addEventListener('click', (e) => {
  document.getElementById('cnfrm_modal_enable').style.display = "none";
});

const querySnapshot2 = await getDocs(collection(db,"vigan_establishments"));
querySnapshot2.forEach(doc2 => {   

  cnfrm_promo3.addEventListener('click', (e) => {
      const updateStats = doc(db, "vigan_establishments", doc2.id)
      var userID = localStorage.getItem("ID")

      if(userID == doc2.id){
          updateDoc(updateStats, {
              Status: "Available",
              DeletedBy: "",
              DeletedDate: ""
          }).then(() => {
              window.location = "pArchives.html"
          })
      }

  });

});

