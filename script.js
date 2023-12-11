// Function to map the forecast to an icon
function getWeatherIcon(forecast) {
    if (forecast.includes('Rain')) {
        return 'icons/rain.svg';
    } else if (forecast.includes('Sunny') && forecast.includes('Cloudy')) {
        return 'icons/sunny_to_cloudy.svg';
    } else if (forecast.includes('Clear') || forecast.includes('Sunny')) {
        return 'icons/sunny.svg';
    } else if (forecast.includes('Cloud')) {
        return 'icons/cloudy.svg';
    } else if (forecast.includes('Fog')) {
        return 'icons/fog.svg';
    } else {
        // Default icon
        return 'icons/sunny_to_cloudy.svg';
    }
}

// Function to fetch weather data from the National Weather Service API
function fetchWeatherData(callback) {
    // URL for the weather station data
    // La Jolla
    const stationUrl = `https://api.weather.gov/points/32.842674,-117.257767`;

    // New York
    // const stationUrl = `https://api.weather.gov/points/40.7145,-74.0071`;
    // Fetch the nearest station
    fetch(stationUrl)
    .then(response => response.json())
    .then(data => {
        // With the station information, we get the forecast URL
        const forecastUrl = data.properties.forecastHourly;
        return fetch(forecastUrl);
    })
    .then(response => response.json())
    .then(data => {
        // The actual hourly forecast data
        const hourlyForecasts = data.properties.periods;

        // We'll just use the first period for this example
        const currentForecast = hourlyForecasts[0];

        // Create an object with the data we need
        const weatherData = {
            condition: currentForecast.shortForecast,
            temperature: {
                value: currentForecast.temperature,
                unit: currentForecast.temperatureUnit
            },
            icon: getWeatherIcon(currentForecast.shortForecast),
            windSpeed: {
                value: currentForecast.windSpeed
            },
            humidity: currentForecast.relativeHumidity
        };

        // Call the callback with the weather data
        callback(weatherData);
    })
    .catch(error => {
        console.error('Error fetching weather data:', error);
    });
}

function updateWeatherWidget(data) {
    const conditionElement = document.querySelector('.weather-condition');
    const tempElement = document.querySelector('.weather-temp');
    const iconElement = document.querySelector('.weather-icon');
    const windElement = document.querySelector('.weather-wind');
    const humidityElement = document.querySelector('.weather-humidity');

    conditionElement.textContent = data.condition;
    tempElement.textContent = `${data.temperature.value}°${data.temperature.unit}`;
    windElement.textContent = `Wind: ${data.windSpeed.value}`;
    humidityElement.textContent = `Humidity: ${data.humidity.value}%`;
    iconElement.src = getWeatherIcon(data.condition);
    iconElement.style.display = 'block';
}

// Fetch weather data on load
document.addEventListener('DOMContentLoaded', function() {
    fetchWeatherData(updateWeatherWidget);
});
