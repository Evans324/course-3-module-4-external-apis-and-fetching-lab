const weatherApiUrl = "https://api.weather.gov/alerts/active?area=";

const stateInput = document.getElementById("state-input");
const fetchButton = document.getElementById("fetch-alerts");
const alertsDisplay = document.getElementById("alerts-display");
const errorMessage = document.getElementById("error-message");

function fetchWeatherAlerts(state) {
    const stateAbbreviation = state.trim().toUpperCase();

    if (!stateAbbreviation) {
        return Promise.reject(new Error("Please enter a state abbreviation."));
    }

    return fetch(`${weatherApiUrl}${stateAbbreviation}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Unable to fetch weather alerts.");
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            return data;
        });
}

function displayAlerts(data) {
    alertsDisplay.innerHTML = "";

    const alertCount = data.features.length;

    const summary = document.createElement("p");
    summary.textContent = `${data.title}: ${alertCount}`;
    alertsDisplay.appendChild(summary);

    const list = document.createElement("ul");

    data.features.forEach(alert => {
        const listItem = document.createElement("li");
        listItem.textContent = alert.properties.headline;
        list.appendChild(listItem);
    });

    alertsDisplay.appendChild(list);
}

function displayError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove("hidden");
}

fetchButton.addEventListener("click", () => {
    const state = stateInput.value;

    stateInput.value = "";
    alertsDisplay.innerHTML = "";
    errorMessage.textContent = "";
    errorMessage.classList.add("hidden");

    fetchWeatherAlerts(state)
        .then(data => {
            displayAlerts(data);
        })
        .catch(error => {
            console.log(error.message);
            displayError(error.message);
        });
});