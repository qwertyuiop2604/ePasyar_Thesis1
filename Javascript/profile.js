import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-app.js";
import { getFirestore, setDoc, doc, getDocs, addDoc, updateDoc, collection } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-firestore.js"
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-auth.js"




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


// CREATE FORM POPUP
const createAcc = document.getElementById('user-create')
const openPop = document.querySelector('.add_acc')
const closePop = document.querySelector('.close-modal')

openPop.addEventListener('click', () => {
  createAcc.style.display = 'block';
});
closePop.addEventListener('click', () => {
  createAcc.style.display = 'none';
});



// FOR REGISTER FORM - ADD TO FIREBASE
const formCreate = document.getElementById('create-form');
const name = document.getElementById('name');
const email = document.getElementById('email');
const pass = document.getElementById('password');
const cpass = document.getElementById('confirm');

formCreate.addEventListener('submit', (e) => {
  e.preventDefault();
  if(name.value == ''){
    alert("ENTER YOUR NAME")
  }
  else if(email.value == ''){
    alert("ENTER YOUR EMAIL")
  }
  else if(pass.value == ''){
    alert("ENTER YOUR PASSWORD")
  }
  else if(cpass.value == ''){
    alert("CONFIRM YOUR PASSWORD")
  }
  else if(pass.value !== cpass.value){
    alert("PASSWORD NOT MATCHED")
  }
  else{
    createUserWithEmailAndPassword(auth, email.value, pass.value)
    .then((userCredential) => {
      
      const user = userCredential.user;
      setDoc(doc(db, "users",  "admin", "admin_account", user.uid), {
        name: name.value,
        email: email.value,
        password: pass.value
      })
      createAcc.style.display = 'none';
      
    })
    
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(errorMessage)
      alert(errorCode)
    });
  }
})


 //Edit FORM POPUP
const editAcc = document.getElementById('user-edit')
const oPop = document.querySelector('.edit_acc')
const cPop = document.querySelector('.close-modal-edit')

oPop.addEventListener('click', () => {
  editAcc.style.display = 'block';
});
cPop.addEventListener('click', () => {
  editAcc.style.display = 'none';
});

// FOR EDIT FORM - UPDATE TO FIREBASE
const formEdit = document.getElementById('edit-form');
const name1 = document.getElementById('name1');
const email1 = document.getElementById('email1');
const pass1 = document.getElementById('password1');
const cpass1 = document.getElementById('confirm1');

formEdit.addEventListener('submit', (e) => {
  e.preventDefault();
  if(name1.value == ''){
    alert("ENTER YOUR NAME")
  }
  else if(email1.value == ''){
    alert("ENTER YOUR EMAIL")
  }
  else if(pass1.value == ''){
    alert("ENTER YOUR PASSWORD")
  }
  else if(cpass1.value == ''){
    alert("CONFIRM YOUR PASSWORD")
  }
  else if(pass1.value !== cpass1.value){
    alert("PASSWORDS DO NOT MATCH")
  }
  else{
    // Update user's information in Firestore
    const user = auth.currentUser;
    setDoc(doc(db, "users",  "admin", "admin_account", user.uid), {
      name: name1.value,
      email: email1.value,
      password: pass1.value
    })
    .then(() => {
      console.log("Document successfully updated!");
      editAcc.style.display = 'none';
    })
    .catch((error) => {
      console.error("Error updating document: ", error);
    });
  }
})


var tbody = document.getElementById('tbody1');

const querySnapshot = await getDocs(collection(db, "users", "admin", "admin_account"));
querySnapshot.forEach((doc) => {
  // doc.data() is never undefined for query doc snapshots  

  if (doc.data().status == "Active") {
    var trow = document.createElement('tr');
    let td1 = document.createElement('td');
    let td2 = document.createElement('td');
    let td3 = document.createElement('td');

    td1.innerHTML = doc.data().name;
    td2.innerHTML = doc.data().email;
    td3.innerHTML = doc.data().password;

    trow.appendChild(td1);
    trow.appendChild(td2);
    trow.appendChild(td3);

    tbody.appendChild(trow);
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
  
            document.getElementById('name1').value = doc.data().name;
            document.getElementById('email1').value = doc.data().email;
            document.getElementById('description1').value = doc.data().password;
           
    }
  }
  }
  });
// Event Listener for delete account button - FINAL
delete_acc.addEventListener('click', () => {
  document.getElementById('delete_acc_modal').style.visibility = "visible";
});
cnl2.addEventListener('click', (e) => {
  document.getElementById('delete_acc_modal').style.visibility = "hidden";
  window.location = "profile.html"
});