const API_KEY = 'hvkJfCR_KjnyvqRdzN0LQ6HALmA';
const API_URL = 'https://ci-jshint.herokuapp.com/api';
const resultsModal = new bootstrap.Modal(document.getElementById('resultsModal'));

/* ============= Check Status Button ======================*/
document.getElementById('status').addEventListener('click', e => getStatus(e)); // e = event

async function getStatus(e) {
    const queryString = `${API_URL}?api_key=${API_KEY}`;

    const response = await fetch(queryString);

    const data = await response.json();

    if(response.ok) {
        // console.log(data.expiry);
        displayStatus(data);
    } else {

        // display exception has to be called BEFORE the THROW
        displayException(data);

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

/* ============= Run Checks Button ======================*/
document.getElementById('submit').addEventListener('click', e => postForm(e));

async function postForm(e) {
    // get the form data from the HTML form 
    const form = processOptions(new FormData(document.getElementById('checksform')));

    /* test 
    for(let e of form.entries()) {
        console.log(e);
    }
    */

    /* test 
    for(let entry of form.entries()) {
        console.log(entry);
    }
    */

    const response = await fetch(API_URL, {
                        method: "POST",
                        headers: {
                                    "Authorization": API_KEY,
                                 }, 
                        body: form
                        });
    
    const data = await response.json();

    if (response.ok) {
        // console.log(data);
        displayErrors(data);
    } else {

        // display exception has to be called BEFORE the THROW
        displayException(data);

        throw new Error(data.error);
    }
}

function displayErrors(data) {

    let heading = `JSHint Results for ${data.file}`;

    if (data.total_errors === 0) {
        results = `<div class="no_errors">No errors reported!</div>`;
    } else {
        results = `<div>Total Errors: <span class="error_count">${data.total_errors}</span></div>`;
        for (let error of data.error_list) {
            results += `<div>At line <span class="line">${error.line}</span>, `;
            results += `column <span class="column">${error.col}</span></div>`;
            results += `<div class="error">${error.error}</div>`;
        }
    }

    document.getElementById('resultsModalTitle').innerHTML = heading;

    document.getElementById('results-content').innerHTML = results;

    resultsModal.show();
}

function processOptions(form) {

    let optionArray = [];

    for (let entry of form.entries()){
        if(entry[0] === "options") {
            optionArray.push(entry[1]);
        }
    }

    form.delete("options");

    form.append("options", optionArray.join());

    return form;
}

// to show error messages in a modal
function displayException(data) {

    let heading = 'An Exception Occurred';
    let results =  `<div>The API returned the status code: <strong>${data.status_code}</strong></div>`;
    results += `<div>Error number: <strong>${data.error_no}</strong></div>`;
    results += `<div>Error text: <strong>${data.error}</strong></div>`;

    // console.log(heading, results, data);

    document.getElementById('resultsModalTitle').innerHTML = heading;

    document.getElementById('results-content').innerHTML = results;

    resultsModal.show();
}