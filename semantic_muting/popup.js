// Function to set a cookie
function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

// Function to get a cookie
function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

// Load the stored terms from cookies when the popup is opened
document.addEventListener('DOMContentLoaded', () => {
    const storedTerms = getCookie('filterTerms');
    if (storedTerms) {
        document.getElementById('filterTerms').value = storedTerms;
    }
});

document.getElementById('filterUppercase').addEventListener('click', () => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {action: "filterUppercase"});
    });
});

document.getElementById('filterByTerms').addEventListener('click', () => {
    const terms = document.getElementById('filterTerms').value;
    setCookie('filterTerms', terms, 7); // Store the terms in a cookie for 7 days
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {action: "filterByTerms", terms: terms});
    });
});
