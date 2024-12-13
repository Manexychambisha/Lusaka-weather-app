const apiKey = "8a1696f399decc1c4c52191cec36d400";
const apiUrl = "https://api.openweathermap.org/data/2.5/";

const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("city_input");
const cityName = document.getElementById("city_name");
const currentTemp = document.getElementById("current_temp");
const weatherDesc = document.getElementById("weather_desc");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("wind_speed");
const forecastContainer = document.getElementById("forecast-container");
const currentIcon = document.getElementById("current-icon");

document.addEventListener("DOMContentLoaded", () => {
    getWeatherData("Lusaka");
});

searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();
    if (city) {
        getWeatherData(city);
    } else {
        alert("Please enter a valid city name.");
    }
});

async function getWeatherData(city) {
    try {
        const weatherResponse = await fetch(`${apiUrl}weather?q=${city}&appid=${apiKey}&units=metric`);
        const weatherData = await weatherResponse.json();

        if (weatherData.cod !== 200) {
            alert(weatherData.message);
            return;
        }

        cityName.textContent = `City: ${weatherData.name}`;
        currentTemp.textContent = `Temperature: ${weatherData.main.temp}°C`;
        weatherDesc.textContent = `Description: ${weatherData.weather[0].description}`;
        humidity.textContent = `Humidity: ${weatherData.main.humidity}%`;
        windSpeed.textContent = `Wind Speed: ${weatherData.wind.speed} km/h`;

        const iconCode = weatherData.weather[0].icon;
        currentIcon.innerHTML = `<img src="https://openweathermap.org/img/wn/${iconCode}@2x.png" alt="${weatherData.weather[0].description}">`;

        const forecastResponse = await fetch(`${apiUrl}forecast?q=${city}&appid=${apiKey}&units=metric`);
        const forecastData = await forecastResponse.json();

        forecastContainer.innerHTML = "";
        forecastData.list.forEach((item, index) => {
            if (index % 8 === 0) {
                const date = new Date(item.dt * 1000).toLocaleDateString();
                const temp = `${item.main.temp}°C`;
                const desc = item.weather[0].description;
                const icon = item.weather[0].icon;

                const forecastCard = document.createElement("div");
                forecastCard.classList.add("forecast-card");
                forecastCard.innerHTML = `
                    <h4>${date}</h4>
                    <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${desc}">
                    <p>${temp}</p>
                    <p>${desc}</p>
                `;
                forecastContainer.appendChild(forecastCard);
            }
        });
    } catch (error) {
        console.error("Error fetching weather data:", error);
        alert("An error occurred while fetching data. Please try again.");
    }
}
