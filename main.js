document.addEventListener('DOMContentLoaded', () => {
  const clientForm = document.getElementById('clientForm');
  const clientList = document.getElementById('clientList');
  const loginBtn = document.getElementById('loginBtn');
  const logoutBtn = document.getElementById('logoutBtn');

  loginBtn.addEventListener('click', () => {
    clientForm.style.display = 'block';
    loginBtn.style.display = 'none';
    logoutBtn.style.display = 'inline-block';
  });

  logoutBtn.addEventListener('click', () => {
    clientForm.style.display = 'none';
    loginBtn.style.display = 'inline-block';
    logoutBtn.style.display = 'none';
  });

  clientForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = clientForm.name.value.trim();
    const surname = clientForm.surname.value.trim();
    const debt = clientForm.debt.value.trim();
    const phone = clientForm.phone.value.trim();

    const li = document.createElement('li');
    li.classList.add('client-card');

    li.innerHTML = `
      <div class="client-name">${name} ${surname}</div>
      <div class="client-details">
        <p>Οφειλή: €${debt}</p>
        <p>Τηλέφωνο: ${phone}</p>
        <button>Επεξεργασία</button>
        <button>Διαγραφή</button>
      </div>
    `;
    clientList.appendChild(li);
    clientForm.reset();
  });
});
