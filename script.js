"use strict";
const submitBtn = document.querySelector(".submit-btn");
const locationBtn = document.querySelector(".location-btn");
const resultContainer = document.querySelector(".result-container");
const userInput = document.querySelector(".input");

const getWeather = async function (location) {
  try {
    // Fetch API
    const res = await fetch(
      `https://api.tomorrow.io/v4/weather/realtime?location=${location}&apikey=sIgddgnlxGLJB93NLE1QZmdblT3FXDIe`
    );
    const weatherData = await res.json();
    //
    console.log(weatherData.data);
    const time = Date.parse(weatherData.data.time);

    // Package values in an object to display weather
    const values = {
      city: location.toUpperCase(),
      time: new Intl.DateTimeFormat("en-US", options).format(time),
      temp: weatherData.data.values.temperature, // celsius
      feelsLike: weatherData.data.values.temperatureApparent, // celsius
      uvIndex: weatherData.data.values.uvIndex, // celsius
      visibility: weatherData.data.values.visibility, // km
      cloudCover: weatherData.data.values.cloudCover, // percentage
      windSpeed: weatherData.data.values.windSpeed, // m/s
    };
    console.log(values.time);
    displayWeather(values);
  } catch (err) {
    console.log(err);
  }
};

// Display Weather
const displayWeather = function (values) {
  resultContainer.innerHTML = `
  <h1>WEATHER FOR ${values.city}</h1>
  <p>As of ${values.time}</p>
  <div class="value-container">
    <div class="data-container">
      <h2 class="data-title">Temperature</h2>
      <div class="data-value">${values.temp} &#8451</div>
    </div>
    <div class="data-container">
      <h2 class="data-title">Feels Like</h2>
      <div class="data-value">${values.feelsLike} &#8451</div>
    </div>
    <div class="data-container">
      <h2 class="data-title">UV Index</h2>
      <div class="data-value">${values.uvIndex}</div>
    </div>
    <div class="data-container">
      <h2 class="data-title">visibility</h2>
      <div class="data-value">${values.visibility}km</div>
    </div>
    <div class="data-container">
      <h2 class="data-title">Cloud Coverage</h2>
      <div class="data-value">${values.cloudCover}%</div>
    </div>
    <div class="data-container">
      <h2 class="data-title">Wind Speed</h2>
      <div class="data-value">${values.windSpeed}m/s</div>
    </div>
  </div>
`;
};

// Handles submitting a location
submitBtn.addEventListener("click", () => {
  const city = userInput.value;
  const formattedCity = formatCity(city);
  getWeather(formattedCity);
  userInput.value = "";
});

// Handles using my location button
locationBtn.addEventListener("click", () =>
  navigator.geolocation.getCurrentPosition(success)
);

// Fetch Location from user
async function success(pos) {
  try {
    userInput.value = "";
    const lat = pos.coords.latitude;
    const long = pos.coords.longitude;
    const res = await fetch(
      `https://geocode.xyz/${lat},${long}?geoit=json&auth=110095389157942291944x82079`
    );
    const data = await res.json();
    getWeather(formatCity(data.city));
  } catch (err) {
    console.log(err.message);
  }
}

// Format options for time stamp
const options = {
  day: "2-digit",
  month: "long",
  year: "numeric",
  hour: "numeric",
  minute: "numeric",
};

// Format city inputs
const formatCity = (str) => str.toLowerCase().replace(" ", "");

// HELPER FUNCTION - Format temperature to farenheit
// HELPER FUNCTION - Format visibility to miles
// HELPER FUNCTION - Format windSpeed to mph
/*
HELPER FUNCTION - Recommendation based on UV Index
0-2: Low
3-5: Moderate
6-7: High
8-10: Very High
11+: Extreme
*/
/*
HELPER FUNCTION - Recommendation based on cloud coverage
0-33%: Sunglasses required
33 - 67% - Sunglasses may be needed throughout the day
67 - 100% - Probably not needed
*/
