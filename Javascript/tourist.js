
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-app.js";
import { getFirestore, addDoc, doc, collection, setDoc, getDocs, updateDoc, deleteDoc} from "https://www.gstatic.com/firebasejs/9.1.1/firebase-firestore.js"


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


let dash = document.getElementById("dash");
dash.addEventListener('click', () =>{
  window.location = 'dash.html'
})
let profile = document.getElementById("profile");
profile.addEventListener('click', () =>{
  window.location = 'profile.html'
})
let promotion = document.getElementById("promotion");
promotion.addEventListener('click', () =>{
  window.location = 'promotion.html'
})
let events = document.getElementById("events");
events.addEventListener('click', () =>{
  window.location = 'events.html'
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
let reviews = document.getElementById("reviews");
reviews.addEventListener("click", () => {
  window.location = "reviews.html";
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

// FOR REGISTER FORM - ADD TO FIREBASE
const formCreate = document.getElementById('create-form');
const categorySelect = document.getElementById('category');
const name = document.getElementById('name');
const description = document.getElementById('description');

formCreate.addEventListener('submit', (e) => {
  e.preventDefault();
  const selectedCategory = categorySelect.value;

  if (selectedCategory === 'blank') {
    alert("SELECT A CATEGORY");
  }else if (name.value == '') {
    alert("ENTER EVENT NAME")
  }else if (description.value == '') {
    alert("ENTER EVENT DESCRIPTION")
  } else {
    addDoc(collection(db, "vigan_establishments"), {
      Category: selectedCategory,
      Name: name.value,
      Description: description.value, // Use description.value for textarea
      Status: "Open"
    }).then(() => {
      createAcc.style.display = 'none';
    }).catch((error) => {
      console.error("Error adding document: ", error);
    });
  }
});

// FOR EDIT MODAL CONFIRMATION - FINAL
const confirmation = document.getElementById('cnfrm_edit')
const cancel = document.querySelector('.cnl')
const confirm = document.querySelector('.cnfrm')

cancel.addEventListener('click', () => {
    confirmation.style.display = 'none'
    modalEdit.style.display = 'block';
    confirm.style.display = 'none';
});



//Edit FORM POPUP
const editAcc = document.getElementById('user-edit');
const oPop = document.querySelector('.edit_acc');
const cPop = document.querySelector('.close-modal-edit');

oPop.addEventListener('click', () => {
  editAcc.style.display = 'block';
});
cPop.addEventListener('click', () => {
  editAcc.style.display = 'none';
});

// FOR EDIT FORM - UPDATE TO FIREBASE
const formEdit = document.getElementById('edit-form');
const categorySelect1 = document.getElementById('category1');
const name1 = document.getElementById('name1');
const description1 = document.getElementById('description1');
//const photos1 = document.getElementById('photos1');


formEdit.addEventListener('submit', (e) => {
  e.preventDefault();
  if (categorySelect1.value === 'blank1') {
    alert("SELECT A CATEGORY"); // Show an alert if no category is selected
  }else if (name1.value == '') {
    alert("ENTER NAME")
  } else if (description1.value == '') {
alert("ENTER DESCRIPTION")
  } else {
    confirmation.style.display = 'block';
    editAcc.style.display = 'none';
  }
});


// FINAL
var tbody = document.getElementById('tbody1');

const querySnapshot = await getDocs(collection(db, "vigan_establishments"));
  querySnapshot.forEach(doc => {

  if (doc.data().Status == "Open") {
    var trow = document.createElement('tr');
    let td1 = document.createElement('td');
    let td2 = document.createElement('td');
    let td3 = document.createElement('td');
    let td4 = document.createElement('td');
    //let td3 = document.createElement('td');

    td1.innerHTML = doc.data().Category;
    td2.innerHTML = doc.data().Name;
    td3.innerHTML = doc.data().Description;
    //td3.innerHTML = doc.data().Photos;

    trow.appendChild(td1);
    trow.appendChild(td2);
    trow.appendChild(td3);

    tbody.appendChild(trow);

    trow.addEventListener('click', (e) =>{

      localStorage.setItem('ID', doc.id)
      console.log(doc.id)
    
      //HIGHLIGHT TABLE ROW WHEN CLICKED - FINAL
      var table = document.getElementById("table");
      var rows = document.getElementsByTagName('tr');
      for(let i = 1; i < rows.length; i++){
        var currentRow = table.rows[i];
        currentRow.onclick = function(){
          Array.from(this.parentElement.children).forEach(function(el){
            el.classList.remove('selected-row');
            
          });
    
          // [...this.parentElement.children].forEach((el) => el.classList.remove('selected-row'));
          this.classList.add('selected-row');
    
              document.getElementById("edit_acc").disabled = false;
              document.getElementById("delete_acc").disabled = false;
    
              document.getElementById('category1').value = doc.data().Category;
              document.getElementById('name1').value = doc.data().Name;
              document.getElementById('description1').value = doc.data().Description;
             // document.getElementById('photos').value = doc.data().Photos;
      }
      
    }
    });
  }
})
const currentDateTime = new Date().toLocaleString();

const querySnapshot2 = await getDocs(collection(db, "vigan_establishments"));
querySnapshot2.forEach(doc2 => {
  const btnEdit = document.getElementById('btnEdit'); // Assuming this is the edit button

  cnfrm.addEventListener('click', (e) => {
    const updateEvents = doc(db, "vigan_establishments", doc2.id);
    var userID = localStorage.getItem("ID");

    if (userID == doc2.id) {
      updateDoc(updateEvents, {
        Category: categorySelect1.value,
        Name: name1.value,
        Description: description1.value
      }).then(() => {
        confirmation.style.display = 'none';
      }).catch((error) => {
        console.error("Error updating document: ", error);
      });
    }
  }); 

  
  cnfrm2.addEventListener('click', (e) => {
    const updateEvents = doc(db, "vigan_establishments", doc2.id)
    var userID = localStorage.getItem("ID")

    if (userID == doc2.id) {
      updateDoc(updateEvents, {
        Status: "Close",
            DeletedBy: "ADMIN",
            DeletedDate: currentDateTime
      }).then(() => {
        delete_acc_modal.style.display = 'none';
      }).catch((error) => {
        console.error("Error updating document: ", error);
      });
    }
  }); 
});

const btnDelete =  document.getElementById('delete_acc');
const btnEdit = document.getElementById('btnEdit');
// Event Listener for delete account button - FINAL
btnDelete.addEventListener('click', (e) => {
  document.getElementById('delete_acc_modal').style.visibility = "visible";
});
cnl2.addEventListener('click', (e) => {
  document.getElementById('delete_acc_modal').style.visibility = "hidden";
  window.location = "tourist.html"
});

//Button to see archived accounts
archived_acc.addEventListener('click', (e) => {
  window.location = "tArchives.html"
})


    
    
