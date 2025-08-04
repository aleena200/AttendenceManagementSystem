function back() {
  window.location.href = 'dashboard.html';
}

// Fetch all students and their attendance
fetch('/attendence/allWithRecords')  // ⚠️ Custom backend endpoint needed
  .then(res => res.json())
  .then(data => {
    const tbody = document.getElementById('attendanceBody');

    data.forEach(student => {
      const row = document.createElement('tr');

      const nameCell = document.createElement('td');
      nameCell.textContent = student.name;

      const rollCell = document.createElement('td');
      rollCell.textContent = student.rollNumber;

      const attendanceCell = document.createElement('td');
      attendanceCell.innerHTML = student.attendance.length > 0
        ? student.attendance.map(a => `${a.date}: ${a.status}`).join('<br>')
        : "No Records";
    
        const actionCell = document.createElement('td');
    actionCell.innerHTML = `
      <button onclick="deleteStudent('${student.rollNumber}')">🗑️ Delete</button>
      <button onclick="editStudent('${student.rollNumber}', '${student.name}')">✏️ Edit</button>
    `;

      row.appendChild(nameCell);
      row.appendChild(rollCell);
      row.appendChild(attendanceCell);
      tbody.appendChild(row);
      tbody.appendChild(actionCell);
    });
  });

function deleteStudent(rollNumber) {
  if (!confirm(`Are you sure you want to delete roll no ${rollNumber}?`)) return;

  fetch(`/attendence/delete/${rollNumber}`, {
    method: 'DELETE'
  })
  .then(res => {
    if (!res.ok) throw new Error('Delete failed');
    alert("✅ Deleted successfully");
    location.reload();
  })
  .catch(err => alert("❌ " + err.message));
}

function editStudent(rollNumber, currentName) {
  const newName = prompt("✏️ Enter new name (Leave empty to skip):", currentName);
  const newRoll = prompt("✏️ Enter new roll number (Leave empty to skip):", rollNumber);
  const dateToEdit = prompt("📅 Enter date of attendance to update (YYYY-MM-DD) or leave empty:");
  let newStatus = null;

  if (dateToEdit) {
    newStatus = prompt("✅ Enter new status for that date (Present/Absent):", "Present");
    if (newStatus !== 'Present' && newStatus !== 'Absent') {
      alert("❌ Invalid status. Use 'Present' or 'Absent'.");
      return;
    }
  }

  fetch(`/attendence/update/${rollNumber}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: newName || undefined,
      newRollNumber: newRoll || undefined,
      date: dateToEdit || undefined,
      status: newStatus || undefined
    })
  })
  .then(res => {
    if (!res.ok) throw new Error("Failed to update");
    alert("✅ Student updated");
    location.reload();
  })
  .catch(err => {
    alert("❌ " + err.message);
  });
}


// 🔍 Optional: Search/Filter function
function filterTable() {
  const input = document.getElementById("searchInput").value.toLowerCase();
  const rows = document.getElementById("attendanceBody").getElementsByTagName("tr");

  for (let row of rows) {
    const name = row.cells[0].textContent.toLowerCase();
    const roll = row.cells[1].textContent.toLowerCase();
    row.style.display = (name.includes(input) || roll.includes(input)) ? "" : "none";
  }
}



