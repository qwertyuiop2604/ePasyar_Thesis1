
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
let tourist = document.getElementById("tourist");
tourist.addEventListener('click', () =>{
  window.location = 'tourist.html'
})
let souvenir = document.getElementById("souvenir");
souvenir.addEventListener('click', () =>{
  window.location = 'souvenir.html'
})
let logout = document.getElementById("logout");
logout.addEventListener('click', () =>{
  window.location = 'index.html'
})


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
const name = document.getElementById('name');
const date = document.getElementById('date');
const description = document.getElementById('description');

formCreate.addEventListener('submit', (e) => {
  e.preventDefault();
  if (name.value.trim() === '') {
    name.classList.add('invalid-input');
  } else {
    name.classList.remove('invalid-input');
    name.classList.add('valid-input');
  }

  if (date.value === '') {
    date.classList.add('invalid-input');
  } else {
    date.classList.remove('invalid-input');
    date.classList.add('valid-input');
  }

  if (description.value.trim() === '') {
    description.classList.add('invalid-input');
  } else {
    description.classList.remove('invalid-input');
    description.classList.add('valid-input');
  }

  if (name.classList.contains('valid-input') 
    && date.classList.contains('valid-input') 
  && description.classList.contains('valid-input')) {
    addDoc(collection(db, "festivals"), {
      Name: name.value,
      Date: date.value,
      Description: description.value.trim(),
      Status: "not done"
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
const name1 = document.getElementById('name1');
const date1 = document.getElementById('date1');
const description1 = document.getElementById('description1');

formEdit.addEventListener('submit', (e) => {
  e.preventDefault();
  if (name1.value.trim() === '') {
    name1.classList.add('invalid-input');
  } else {
    name1.classList.remove('invalid-input');
    name1.classList.add('valid-input');
  }

  if (date1.value === '') {
    date1.classList.add('invalid-input');
  } else {
    date1.classList.remove('invalid-input');
    date1.classList.add('valid-input');
  }

  if (description1.value.trim() === '') {
    description1.classList.add('invalid-input');
  } else {
    description1.classList.remove('invalid-input');
    description1.classList.add('valid-input');
  }

  if (name1.classList.contains('valid-input') && date1.classList.contains('valid-input') && description1.classList.contains('valid-input')) {
    confirmation.style.display = 'block';
    editAcc.style.display = 'none';
  }
});


// FINAL
var tbody = document.getElementById('tbody1');

const querySnapshot = await getDocs(collection(db, "festivals"));
  querySnapshot.forEach(doc => {

  if (doc.data().Status == "not done") {
    var trow = document.createElement('tr');
    let td1 = document.createElement('td');
    let td2 = document.createElement('td');
    let td3 = document.createElement('td');

    td1.innerHTML = doc.data().Name;
    td2.innerHTML = doc.data().Date;
    td3.innerHTML = doc.data().Description;

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
    
              document.getElementById('name1').value = doc.data().Name;
              document.getElementById('date1').value = doc.data().Date;
              document.getElementById('description1').value = doc.data().Description;
             
      }
      
    }
    });
  }
})
const currentDateTime = new Date().toLocaleString();

const querySnapshot2 = await getDocs(collection(db, "festivals"));
querySnapshot2.forEach(doc2 => {
  const btnEdit = document.getElementById('btnEdit'); // Assuming this is the edit button

  cnfrm.addEventListener('click', (e) => {
    const updateEvents = doc(db, "festivals", doc2.id);
    var userID = localStorage.getItem("ID");

    if (userID == doc2.id) {
      updateDoc(updateEvents, {
        Name: name1.value,
        Date: date1.value,
        Description: description1.value
      }).then(() => {
        confirmation.style.display = 'none';
      }).catch((error) => {
        console.error("Error updating document: ", error);
      });
    }
  }); 

  
  cnfrm2.addEventListener('click', (e) => {
    const updateEvents = doc(db, "festivals", doc2.id)
    var userID = localStorage.getItem("ID")

    if (userID == doc2.id) {
      updateDoc(updateEvents, {
        Status: "done",
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
  window.location = "events.html"
});

//Button to see archived accounts
archived_acc.addEventListener('click', (e) => {
  window.location = "archives.html"
})


    
    
