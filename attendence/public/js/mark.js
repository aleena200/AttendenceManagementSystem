function back() {
  window.location.href = 'dashboard.html';
}

const tbody = document.getElementById('studentTableBody');

// 1. Fetch all students
fetch('/attendence/all')
  .then(res => res.json())
  .then(data => {
    data.forEach((student, i) => {
      const row = document.createElement('tr');

      const nameCell = document.createElement('td');
      nameCell.textContent = student.name;

      const rollCell = document.createElement('td');
      rollCell.textContent = student.rollNumber;

      const statusCell = document.createElement('td');
      statusCell.innerHTML = `
        <select name="status${i}">
          <option value="Present">Present</option>
          <option value="Absent">Absent</option>
        </select>
        <input type="hidden" name="rollNumber${i}" value="${student.rollNumber}">
      `;

      row.appendChild(nameCell);
      row.appendChild(rollCell);
      row.appendChild(statusCell);
      tbody.appendChild(row);
    });

    // 2. Submit attendance
    document.getElementById('attendanceForm').addEventListener('submit', function (e) {
      e.preventDefault();

      const today = new Date().toISOString().slice(0, 10);
      const total = data.length;
      const promises = [];

      for (let i = 0; i < total; i++) {
        const roll = document.querySelector(`[name="rollNumber${i}"]`).value;
        const status = document.querySelector(`[name="status${i}"]`).value;

        const req = fetch('/attendence/mark', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ rollNumber: roll, date: today, status })
        })
        .then(res => {
          if (!res.ok) {
            return res.text().then(text => { throw new Error(text); });
          }
          return res.text(); // or .json() if your backend returns JSON
        });

        promises.push(req);
      }

      Promise.all(promises)
        .then(() => {
          alert("✅ Attendance submitted successfully!");
          back();
        })
        .catch(err => {
          alert(`❌ Error while submitting: ${err.message}`);
          console.error(err);
        });
    });
  })
  .catch(err => {
    alert("❌ Failed to load students");
    console.error(err);
  });
