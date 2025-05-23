async function updateStatus() {
    try {
        const response = await fetch('https://conclave-backend-aaoy.onrender.com/api/check-election');
        const data = await response.json();
        const statusElement = document.getElementById('conclave-status');

        if (data.popeElected) {
            statusElement.textContent = 'A pope has been elected!';
            statusElement.style.color = 'green';
        } else {
            statusElement.textContent = 'No pope has been elected yet.';
            statusElement.style.color = 'red';
        }
    } catch (error) {
        console.error('Error fetching conclave status:', error);
        const statusElement = document.getElementById('conclave-status');
        statusElement.textContent = 'Error fetching status.';
        statusElement.style.color = 'gray';
    }
}

// Update status every minute
setInterval(updateStatus, 60000);
updateStatus();
