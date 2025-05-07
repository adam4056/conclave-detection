// filepath: c:\Users\Adam\Documents\Programovani 25\Nová složka\app.js

document.addEventListener('DOMContentLoaded', function() {
    async function updateStatus() {
        const response = await fetch('/api/check-election');
        const data = await response.json();
        const statusElement = document.getElementById('conclave-status');

        if (data.popeElected) {
            statusElement.textContent = 'A pope has been elected!';
            statusElement.style.color = 'green';
        } else {
            statusElement.textContent = 'No pope has been elected yet.';
            statusElement.style.color = 'red';
        }
    }

    setInterval(updateStatus, 60000); // Aktualizace každou minutu
});