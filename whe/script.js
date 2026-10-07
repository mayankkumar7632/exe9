const API_KEY = "d63ad3a30659f7aec975fb181cc969eb";
const searchForm = document.getElementById("searchForm");
const cityInput = document.getElementById("cityInput");
const weatherData = document.getElementById("weatherData");
const updatedAt = document.getElementById("updatedAt");

searchForm.addEventListener("submit", event => {
    event.preventDefault();
    getWeather(cityInput.value.trim());
});

function getWeather(city) {
    if (!city) {
        return;
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`;

    weatherData.innerHTML = `
        <div class="loading-state">
            <div class="spinner"></div>
            <p>Reading the latest conditions...</p>
        </div>
    `;
    updatedAt.textContent = "Updating now";

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(response.status === 404 ? "City not found" : `Request failed: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const condition = data.weather[0];
            const iconUrl = `https://openweathermap.org/img/wn/${condition.icon}@2x.png`;
            const localTime = new Date((Date.now() / 1000 + data.timezone) * 1000);

            weatherData.innerHTML = `
                <div class="location-row">
                    <div>
                        <p class="label">CURRENT CONDITIONS</p>
                        <h2>${data.name}, ${data.sys.country}</h2>
                    </div>
                    <p class="local-time">${formatTime(localTime)}</p>
                </div>
                <div class="temperature-row">
                    <img src="${iconUrl}" alt="${condition.description}">
                    <div>
                        <p class="temperature">${Math.round(data.main.temp)}<span>°C</span></p>
                        <p class="condition">${condition.description}</p>
                        <p class="feels-like">Feels like ${Math.round(data.main.feels_like)}°</p>
                    </div>
                </div>
                <div class="metrics">
                    <div class="metric"><span>Humidity</span><strong>${data.main.humidity}%</strong></div>
                    <div class="metric"><span>Wind</span><strong>${data.wind.speed} m/s</strong></div>
                    <div class="metric"><span>Pressure</span><strong>${data.main.pressure} hPa</strong></div>
                    <div class="metric"><span>Visibility</span><strong>${(data.visibility / 1000).toFixed(1)} km</strong></div>
                </div>
            `;
            updatedAt.textContent = `Updated ${new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`;
        })
        .catch(error => {
            console.error("Weather error:", error);
            weatherData.innerHTML = `
                <div class="error-state">
                    <span class="error-icon">!</span>
                    <h2>${error.message === "City not found" ? "City not found" : "Weather unavailable"}</h2>
                    <p>${error.message === "City not found" ? "Check the spelling and try another location." : "Check that your OpenWeather API key is active, then try again."}</p>
                </div>
            `;
            updatedAt.textContent = "Could not update";
        });
}

function formatTime(date) {
    return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

getWeather(cityInput.value.trim());