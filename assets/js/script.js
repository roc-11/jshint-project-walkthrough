const API_KEY = 'hvkJfCR_KjnyvqRdzN0LQ6HALmA';
const API_URL = 'https://ci-jshint.herokuapp.com/api';
const resultsModal = new bootstrap.Modal(document.getElementById('resultsModal'));

document.getElementById('status').addEventListener('click', event => getStatus(event));

async function getStatus(e) {
    const queryString = `${API_URL}?api_key=${API_KEY}`;

    const response = await fetch(queryString);

    const data = await response.json();

    if(response.ok) {
        // console.log(data.expiry);
        displayStatus(data);
    } else {
        throw new Error(data.error);
    }
}

function displayStatus(data) {

    let heading = 'API Status Key';
    let results =  `<div>Your key is valid until</div>`;
    results += `<div class="key-status">${data.expiry}</div>`;

    document.getElementById('resultsModalTitle').innerHTML = heading;

    document.getElementById('results-content').innerHTML = results;

    resultsModal.show();
}