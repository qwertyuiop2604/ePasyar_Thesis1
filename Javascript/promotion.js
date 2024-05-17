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
let events = document.getElementById("events");
events.addEventListener('click', () =>{
  window.location = 'events.html'
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




// CREATE FORM POPUP
const createPromotion = document.getElementById('user-create');
const openPop = document.querySelector('.add_acc');
const closePop = document.querySelector('.close-modal');

openPop.addEventListener('click', () => {
  createPromotion.style.display = 'block';
});
closePop.addEventListener('click', () => {
    createPromotion.style.display = 'none';
});

// FOR REGISTER FORM - ADD TO FIREBASE
const formCreate = document.getElementById('create-form');
const categorySelect = document.getElementById('category');
const Name = document.getElementById('name');
const Owner = document.getElementById('owner');
const Number = document.getElementById('number');
const Email = document.getElementById('email');
const Address = document.getElementById('address');
const Rooms = document.getElementById('rooms');
const Capacity = document.getElementById('room1');
const Rates = document.getElementById('room2');


formCreate.addEventListener('submit', (e) => {
  e.preventDefault();

  const selectedCategory = categorySelect.value;

if (selectedCategory.trim() === '') {
  categorySelect.classList.add('invalid-input');
} else {
  categorySelect.classList.remove('invalid-input');
  categorySelect.classList.add('valid-input');
}

if (Name.value.trim() === '') {
  Name.classList.add('invalid-input');

} else {
  Name.classList.remove('invalid-input');
  Name.classList.add('valid-input');
}

if (Owner.value.trim() === '') {
  Owner.classList.add('invalid-input');
 
} else {
  Owner.classList.remove('invalid-input');
  Owner.classList.add('valid-input');
}

if (Number.value.trim() === '') {
  Number.classList.add('invalid-input');

} else {
  Number.classList.remove('invalid-input');
  Number.classList.add('valid-input');
}

if (Email.value.trim() === '') {
  Email.classList.add('invalid-input');

} else {
  Email.classList.remove('invalid-input');
  Email.classList.add('valid-input');
}

if (Address.value.trim() === '') {
  Address.classList.add('invalid-input');

} else {
  Address.classList.remove('invalid-input');
  Address.classList.add('valid-input');
}

if (Rooms.value.trim() === '') {
  Rooms.classList.add('invalid-input');

} else {
  Rooms.classList.remove('invalid-input');
  Rooms.classList.add('valid-input');
}

if (Capacity.value.trim() === '') {
  Capacity.classList.add('invalid-input');

} else {
  Capacity.classList.remove('invalid-input');
  Capacity.classList.add('valid-input');
}

if (Rates.value.trim() === '') {
  Rates.classList.add('invalid-input');

} else {
  Rates.classList.remove('invalid-input');
  Rates.classList.add('valid-input');
}

// If all fields are valid, submit the form
if  (Name.classList.contains('valid-input') 
  && Owner.classList.contains('valid-input') 
&& Number.classList.contains('valid-input')
&& Email.classList.contains('valid-input') 
  && Address.classList.contains('valid-input') 
&& Rooms.classList.contains('valid-input')
&& Capacity.classList.contains('valid-input') 
  && Rates.classList.contains('valid-input') 
)
{
  addDoc(collection(db, "vigan_establishments"), {
    Category: selectedCategory,
      Name: Name.value,
      Owner: Owner.value,
      Number: Number.value,
      Email: Email.value,
      Address: Address.value,
      Rooms: Rooms.value,
      Capacity: Capacity.value,
      Rates: Rates.value,
      Status: "Available"
  }).then(() => {
    createPromotion.style.display = 'none';
  }).catch((error) => {
    console.error("Error adding document: ", error);
    });
  }
});

// For edit modal confirmation
const confirmationPromo = document.getElementById('cnfrm_edit');
const cancelPromo = document.getElementById('cnl_promo');
const confirmPromo = document.getElementById('cnfrm_promo');

cancelPromo.addEventListener('click', () => {
  confirmationPromo.style.display = 'none';
  modalEditPromo.style.display = 'block';
  confirmPromo.style.display = 'none';
});


//Edit FORM POPUP
const editPromotion = document.getElementById('user-edit');
const opPop = document.querySelector('.edit_acc');
const cloPop = document.querySelector('.close-modal-edit');

opPop.addEventListener('click', () => {
  editPromotion.style.display = 'block';
});
cloPop.addEventListener('click', () => {
  editPromotion.style.display = 'none';
});

// FOR EDIT FORM - UPDATE TO FIREBASE
const formEdit = document.getElementById('edit-form');
const categorySelect1 = document.getElementById('category1');
const Name1 = document.getElementById('name1');
const Owner1 = document.getElementById('owner1');
const Number1 = document.getElementById('number1');
const Email1 = document.getElementById('email1');
const Address1 = document.getElementById('address1');
const Rooms1 = document.getElementById('rooms1');
const Capacity1 = document.getElementById('room11');
const Rates1 = document.getElementById('room21');


formEdit.addEventListener('submit', async (e) => {
  e.preventDefault();

  const selectedId = localStorage.getItem('ID');
  const docRef = doc(db, "vigan_establishments", selectedId);

  if (selectedCategory.trim() === '') {
  categorySelect.classList.add('invalid-input');
} else {
  categorySelect.classList.remove('invalid-input');
  categorySelect.classList.add('valid-input');
}

if (Name.value.trim() === '') {
  Name.classList.add('invalid-input');

} else {
  Name.classList.remove('invalid-input');
  Name.classList.add('valid-input');
}

if (Owner.value.trim() === '') {
  Owner.classList.add('invalid-input');
 
} else {
  Owner.classList.remove('invalid-input');
  Owner.classList.add('valid-input');
}

if (Number.value.trim() === '') {
  Number.classList.add('invalid-input');

} else {
  Number.classList.remove('invalid-input');
  Number.classList.add('valid-input');
}

if (Email.value.trim() === '') {
  Email.classList.add('invalid-input');

} else {
  Email.classList.remove('invalid-input');
  Email.classList.add('valid-input');
}

if (Address.value.trim() === '') {
  Address.classList.add('invalid-input');

} else {
  Address.classList.remove('invalid-input');
  Address.classList.add('valid-input');
}

if (Rooms.value.trim() === '') {
  Rooms.classList.add('invalid-input');

} else {
  Rooms.classList.remove('invalid-input');
  Rooms.classList.add('valid-input');
}

if (Capacity.value.trim() === '') {
  Capacity.classList.add('invalid-input');

} else {
  Capacity.classList.remove('invalid-input');
  Capacity.classList.add('valid-input');
}

if (Rates.value.trim() === '') {
  Rates.classList.add('invalid-input');

} else {
  Rates.classList.remove('invalid-input');
  Rates.classList.add('valid-input');
}

// If all fields are valid, submit the form
if  (Name.classList.contains('valid-input') 
  && Owner.classList.contains('valid-input') 
&& Number.classList.contains('valid-input')
&& Email.classList.contains('valid-input') 
  && Address.classList.contains('valid-input') 
&& Rooms.classList.contains('valid-input')
&& Capacity.classList.contains('valid-input') 
  && Rates.classList.contains('valid-input') 
)
{
    await updateDoc(docRef, {
      Category: categorySelect1.value,
      Name: Name1.value,
      Owner: Owner1.value,
      Number: Number1.value,
      Email: Email1.value,
      Address: Address1.value,
      Rooms: Rooms1.value,
      Capacity: Capacity1.value,
      Rates: Rates1.value,
     
    });
    editPromotion.style.display = 'none';
  }
});



// FINAL
var tbody = document.getElementById('tbody1');

const querySnapshot = await getDocs(collection(db, "vigan_establishments"));
  querySnapshot.forEach(doc => {

  if (doc.data().Status == "Available") {
    var trow = document.createElement('tr');
    let td1 = document.createElement('td');
    let td2 = document.createElement('td');
    let td3 = document.createElement('td');
    let td4 = document.createElement('td');
    let td5 = document.createElement('td');
    let td6 = document.createElement('td');
    let td7 = document.createElement('td');
    let td8 = document.createElement('td');
    let td9 = document.createElement('td');
  
  

    td1.innerHTML = doc.data().Category;
    td2.innerHTML = doc.data().Name;
    td3.innerHTML = doc.data().Owner;
    td4.innerHTML = doc.data().Number;
    td5.innerHTML = doc.data().Email;
    td6.innerHTML = doc.data().Address;
    td7.innerHTML = doc.data().Rooms;
    td8.innerHTML = doc.data().Capacity;
    td9.innerHTML = doc.data().Rates;
   

    trow.appendChild(td1);
    trow.appendChild(td2);
    trow.appendChild(td3);
    trow.appendChild(td4);
    trow.appendChild(td5);
    trow.appendChild(td6);
    trow.appendChild(td7);
    trow.appendChild(td8);
    trow.appendChild(td9);
    

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
              document.getElementById('owner1').value = doc.data().Owner;
              document.getElementById('number1').value = doc.data().Number;
              document.getElementById('email1').value = doc.data().Email;
              document.getElementById('address1').value = doc.data().Address;
              document.getElementById('rooms1').value = doc.data().Rooms;
              document.getElementById('room11').value = doc.data().Capacity;
              document.getElementById('room21').value = doc.data().Rates;
              
             
      }
      
    }
    });
  }
})
 
const currentDateTime = new Date().toLocaleString();

const querySnapshot2 = await getDocs(collection(db, "vigan_establishments"));
querySnapshot2.forEach(doc2 => {
  const btnEditPromo = document.getElementById('btnEditPromo'); // Assuming this is the edit button

  cnfrm_promo.addEventListener('click', (e) => {
    const updatePromotion = doc(db, "vigan_establishments", doc2.id);
    var userID = localStorage.getItem("ID");

    if (userID == doc2.id) {
      updateDoc(updatePromotion, {
      Category: categorySelect1.value,
      Name: Name1.value,
      Owner: Owner1.value,
      Number: Number1.value,
      Email: Email1.value,
      Address: Address1.value,
      Rooms: Rooms1.value,
      Capacity: Capacity1.value,
      Rates: Rates1.value,
      
      }).then(() => {
        confirmationPromo.style.display = 'none';
      }).catch((error) => {
        console.error("Error updating document: ", error);
      });
    }
  }); 

  
  cnfrm_promo2.addEventListener('click', (e) => {
    const updatePromotion = doc(db, "vigan_establishments", doc2.id)
    var userID = localStorage.getItem("ID")

    if (userID == doc2.id) {
      updateDoc(updatePromotion, {
        Status: "Not Available",
            DeletedBy: "ADMIN",
            DeletedDate: currentDateTime
      }).then(() => {
        delete_acc_modal.style.display = 'none';
      }).catch((error) => {
        console.error("Error deleting document: ", error);
      });
    }
  }); 
});

const btnDelete =  document.getElementById('delete_acc');
const btnEditPromo = document.getElementById('btnEditPromo');
// Event Listener for delete account button - FINAL
btnDelete.addEventListener('click', (e) => {
  document.getElementById('delete_acc_modal').style.display = "block";
});
cnl_promo2.addEventListener('click', (e) => {
  document.getElementById('delete_acc_modal').style.display = "none";
  window.location = "promotion.html"
});

// Button to see archived accounts
const pArchive = document.getElementById('promoArchive');
pArchive.addEventListener('click', (e) => {
  window.location = "pArchives.html";
});
