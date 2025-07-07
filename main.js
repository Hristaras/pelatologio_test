
const firebaseConfig = {
  apiKey: "AIzaSyBQD6HW1wWf-5pJITQgJMRbvcRKdpCSm_c",
  authDomain: "pelatologio2.firebaseapp.com",
  databaseURL: "https://pelatologio2-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "pelatologio2",
  storageBucket: "pelatologio2.firebasestorage.app",
  messagingSenderId: "463233168409",
  appId: "1:463233168409:web:adf751fba0851e23042688"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.database();

let currentUser = null;
let editKey = null;

document.getElementById('loginBtn').addEventListener('click', () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider);
});

auth.onAuthStateChanged(user => {
  if (user) {
    currentUser = user;
    document.getElementById('clientForm').style.display = 'block';
    document.getElementById('logoutBtn').style.display = 'inline-block';
    document.getElementById('loginBtn').style.display = 'none';
    loadClients();
  } else {
    currentUser = null;
    document.getElementById('clientForm').style.display = 'none';
    document.getElementById('logoutBtn').style.display = 'none';
    document.getElementById('loginBtn').style.display = 'inline-block';
    document.getElementById('clientList').innerHTML = '';
  }
});

document.getElementById('logoutBtn').addEventListener('click', () => {
  auth.signOut();
});

document.getElementById('clientForm').addEventListener('submit', e => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target));
  db.ref('clients/' + currentUser.uid).push(data);
  e.target.reset();
});

document.getElementById('editForm').addEventListener('submit', e => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target));
  db.ref('clients/' + currentUser.uid + '/' + editKey).set(data);
  document.getElementById('editForm').style.display = 'none';
  e.target.reset();
});

document.getElementById('cancelEdit').addEventListener('click', () => {
  document.getElementById('editForm').style.display = 'none';
});

function loadClients() {
  db.ref('clients/' + currentUser.uid).on('value', snapshot => {
    const list = document.getElementById('clientList');
    list.innerHTML = '';
    snapshot.forEach(child => {
      const data = child.val();
      const li = document.createElement('li');
      li.innerHTML = `
        <div><strong>${data.name} ${data.surname}</strong> - Οφειλή: ${data.debt}€ - Τηλ: ${data.phone}</div>
        <div class="client-actions">
          <button onclick="editClient('${child.key}', ${JSON.stringify(data).replace(/"/g, '&quot;')})">✏️</button>
          <button onclick="deleteClient('${child.key}')">🗑️</button>
        </div>`;
      list.appendChild(li);
    });
  });
}

function editClient(key, data) {
  editKey = key;
  const form = document.getElementById('editForm');
  form.name.value = data.name;
  form.surname.value = data.surname;
  form.debt.value = data.debt;
  form.phone.value = data.phone;
  form.style.display = 'block';
}

function deleteClient(key) {
  if (confirm('Είστε σίγουροι ότι θέλετε να διαγράψετε τον πελάτη;')) {
    db.ref('clients/' + currentUser.uid + '/' + key).remove();
  }
}
