// Handle reservation form submission
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('reservationForm');

    form.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent default form submission

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const date = document.getElementById('date').value;
        const time = document.getElementById('time').value;
        const guests = document.getElementById('guests').value;
        const franchise = document.getElementById('franchise').value; // Get selected franchise

        // Create a reservation log
        const reservationLog = {
            name: name,
            email: email,
            date: date,
            time: time,
            guests: guests,
            franchise: franchise // Include franchise in the log
        };

        // Store the log in localStorage
        const logs = JSON.parse(localStorage.getItem('reservationLogs')) || [];
        logs.push(reservationLog);
        localStorage.setItem('reservationLogs', JSON.stringify(logs));

        // Redirect to confirmation page with parameters
        window.location.href = `confirmation.html?name=${encodeURIComponent(name)}&date=${encodeURIComponent(date)}&time=${encodeURIComponent(time)}&guests=${encodeURIComponent(guests)}&franchise=${encodeURIComponent(franchise)}`; // Include franchise in the URL
    });
});

// Populate logs on the IT Desk page
function populateLogs() {
    const logs = JSON.parse(localStorage.getItem('reservationLogs')) || [];
    const logsBody = document.getElementById('logsBody');

    logs.forEach(log => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${log.date}</td><td>${log.time}</td><td>${log.name}</td><td>${log.franchise}</td>`; // Include franchise in the log display
        logsBody.appendChild(row);
    });
}

// Call populateLogs when IT Desk page is loaded
if (document.body.classList.contains('it-desk')) {
    populateLogs();
}
