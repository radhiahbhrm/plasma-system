

 // Function to switch between form

function showForm(formId) {
    const forms = document.querySelectorAll('.form-box');
    forms.forEach(form => form.style.display = 'none');
    const targetForm = document.getElementById(formId);
    if (targetForm) {
        targetForm.style.display = 'block';
        // Clear the plasma order form
        if (formId === 'Start-Order') {
            const startOrderForm = targetForm.querySelector('form');
            if (startOrderForm) startOrderForm.reset();
        }
        // Toggle specific messages in Plasma Order Record view
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
 
// Function to handle form submission and populate the table
document.querySelector('#Start-Order form').addEventListener('submit', function (e) {
    e.preventDefault();
    const name = this.elements['Name'].value;
    const lot = this.elements['Lot Number'].value;
    const module = this.elements['Module'].value;
    let status = 'PENDING';
    const table = document.querySelector('#line\\ order\\ records table');
    const newRow = table.insertRow(-1);
    const now = new Date();
    const formattedDate = now.toLocaleString();
    newRow.innerHTML = `
<td>${formattedDate}</td>
<td>${lot}</td>
<td>${module}</td>
<td>${name}</td>
<td class="status-cell" style="background: yellow;">PENDING</td>
<td>
<button class="action-btn cancel-btn" style="background: green; color: white; border: none; padding: 6px 12px; cursor: pointer;">
   CANCEL
</button>
</td>
    `;
    window.lastAction='start';
    showForm('line order records');
});
// Cancel button functionality
document.querySelector('#line\\ order\\ records table').addEventListener('click', function (e) {
    if (e.target.classList.contains('cancel-btn')) {
        const row = e.target.closest('tr');
        row.remove();
    }
});

// Handle status change and update background color
document.querySelector('#line\\ order\\ records table').addEventListener('change', function (e) {
    if (e.target.classList.contains('status-select')) {
        const selectedStatus = e.target.value;
        e.target.style.background = selectedStatus === 'PENDING' ? 'yellow' : 'lightgreen';
    }
})

document.querySelector('#close-order-btn').addEventListener('click', function () {
    window.lastAction='close'
    openCloseOrderForm();
});

function openCloseOrderForm() {
  showForm('close-order-form');
  const closeOrderTable = document.querySelector('#closeOrderTable');
  closeOrderTable.innerHTML =`
<tr>
<th>Date</th>
<th>Lot Number</th>
<th>Module</th>
<th>Order By</th>
<th>Status</th>
<th>Action</th>
</tr>
  `;
  const mainTable = document.querySelector('#line\\ order\\ records table');
  Array.from(mainTable.rows).forEach((row, index) => {
    if (index === 0) return; // skip header
    const statusCell = row.cells[4];
    if (statusCell.textContent.trim() === 'PENDING') {
      const clonedRow = row.cloneNode(true);
      const actionCell = clonedRow.cells[5];
      // Replace button with CLOSE action
      clonedRow.setAttribute('data-row-id',index)
      actionCell.innerHTML = `<button class="close-btn">Close</button>`;
      closeOrderTable.appendChild(clonedRow);
    }
  });
}

//Change status from pending to ready
document.querySelector('#closeOrderTable').addEventListener('click', function (e) {
  if (e.target.classList.contains('close-btn')) {
    const clonedRow=e.target.closest('tr');
    const rowIndex = clonedRow.dataset.rowId;
    const mainTable = document.querySelector('#line\\ order\\ records table');
    const targetRow = mainTable.rows[rowIndex];
    const statusCell = targetRow.cells[4];
    const actionCell = targetRow.cells[5];
    statusCell.textContent = 'READY';
    statusCell.style.background = 'lightgreen';
    actionCell.innerHTML = `<button class="collect-btn" style="background: blue; color: white; padding: 6px;">COLLECT</button>`;
    // Remove from Close Order Table
    clonedRow.remove();
  }
});

// Handle collect button to remove the row
document.querySelector('#line\\ order\\ records table').addEventListener('click', function (e) {
    if (e.target.classList.contains('collect-btn')) {
        const row = e.target.closest('tr');
        row.remove();
    }
});
