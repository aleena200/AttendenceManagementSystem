function addStudent() {
  const name = document.getElementById('name').value;
  const rollNumber = document.getElementById('roll').value;

  fetch('/attendence/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, rollNumber })
  })
  .then(res => res.text())
  .then(msg => {
    alert(msg);
    back();
  });
}

function back() {
  window.location.href = 'dashboard.html';
}
