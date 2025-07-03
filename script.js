<script type="module">

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";

import { getDatabase, ref, onValue, push, remove, update } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

// ✅ Your Firebase Config

const firebaseConfig = {

  apiKey: "AIzaSyBE6pPXYxsNZn5cD5sXFshq1fOuagH-Klo",

  authDomain: "plasma-ordering-d043a.firebaseapp.com",

  projectId: "plasma-ordering-d043a",

  storageBucket: "plasma-ordering-d043a.appspot.com",

  messagingSenderId: "252235182011",

  appId: "1:252235182011:web:be82e344dbb93c11371e9e",

  measurementId: "G-HXDJFJM8DV"

};

// ✅ Initialize Firebase

const app = initializeApp(firebaseConfig);

const db = getDatabase(app);

// 🔁 Realtime listener to update the order table

const table = document.querySelector('#line\\ order\\ records table');

const ordersRef = ref(db, 'orders');

onValue(ordersRef, (snapshot) => {

  const data = snapshot.val();

  table.innerHTML = `
<tr>
<th>Date</th>
<th>Lot Number</th>
<th>Module</th>
<th>Order By</th>
<th>Status</th>
<th>Action</th>
</tr>

  `;

  for (const id in data) {

    const order = data[id];

    const row = table.insertRow(-1);

    row.innerHTML = `
<td>${order.date}</td>
<td>${order.lot}</td>
<td>${order.module}</td>
<td>${order.name}</td>
<td class="status-cell" style="background: ${order.status === 'PENDING' ? 'yellow' : 'lightgreen'};">${order.status}</td>
<td>

        ${order.status === 'READY'

          ? `<button class="collect-btn" data-id="${id}">COLLECT</button>`

          : `<button class="cancel-btn" data-id="${id}">CANCEL</button>`}
</td>

    `;

  }

});

// ✏️ Handle Start Order

document.querySelector('#Start-Order form').addEventListener('submit', function (e) {

  e.preventDefault();

  const name = this.elements['Name'].value;

  const lot = this.elements['Lot Number'].value;

  const module = this.elements['Module'].value;

  const now = new Date().toLocaleString();

  push(ordersRef, {

    name,

    lot,

    module,

    date: now,

    status: "PENDING"

  });

  window.lastAction = 'start';

  showForm('line order records');

});

// 🗑 Cancel

table.addEventListener('click', function (e) {

  if (e.target.classList.contains('cancel-btn')) {

    const id = e.target.dataset.id;

    remove(ref(db, `orders/${id}`));

  }

  // ✅ COLLECT (Remove after READY)

  if (e.target.classList.contains('collect-btn')) {

    const row = e.target.closest('tr');

    const id = e.target.dataset.id;

    remove(ref(db, `orders/${id}`));

  }

});

// 🟢 Close Order Handling (to mark as READY)

document.querySelector('#close-order-btn').addEventListener('click', function () {

  window.lastAction = 'close';

  openCloseOrderForm();

});

function openCloseOrderForm() {

  showForm('close-order-form');

  const closeTable = document.getElementById('closeOrderTable');

  closeTable.innerHTML = `
<tr>
<th>Date</th>
<th>Lot Number</th>
<th>Module</th>
<th>Order By</th>
<th>Status</th>
<th>Action</th>
</tr>

  `;

  onValue(ordersRef, (snapshot) => {

    const data = snapshot.val();

    for (const id in data) {

      const order = data[id];

      if (order.status === 'PENDING') {

        const row = closeTable.insertRow(-1);

        row.innerHTML = `
<td>${order.date}</td>
<td>${order.lot}</td>
<td>${order.module}</td>
<td>${order.name}</td>
<td>PENDING</td>
<td><button class="close-btn" data-id="${id}">CLOSE</button></td>

        `;

      }

    }

  });

}

// Update status to READY

document.querySelector('#closeOrderTable').addEventListener('click', function (e) {

  if (e.target.classList.contains('close-btn')) {

    const id = e.target.dataset.id;

    update(ref(db, `orders/${id}`), {

      status: "READY"

    });

    e.target.closest('tr').remove();

  }

});

// UI Form Handling

function showForm(formId) {

  const forms = document.querySelectorAll('.form-box');

  forms.forEach(form => form.style.display = 'none');

  const target = document.getElementById(formId);

  if (target) {

    target.style.display = 'block';

    const startMsg = document.getElementById('start-order-msg');

    const closeMsg = document.getElementById('close-order-msg');

    if (formId === 'line order records') {

      if (window.lastAction === 'start') {

        startMsg.style.display = 'block';

        closeMsg.style.display = 'none';

      } else if (window.lastAction === 'close') {

        startMsg.style.display = 'none';

        closeMsg.style.display = 'block';

      }

    }

  }

}
</script>
 
