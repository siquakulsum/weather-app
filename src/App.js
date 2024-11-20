import React, { useState } from "react";
import "./App.css";

function App() {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState("/default.gif");

  const apiKey = "05bbdada402fc61daee58e5b1df2b761";

  const getWeather = async () => {
    if (!city) {
      alert("Please enter a city");
      return;
    }

    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

    try {
      const weatherResponse = await fetch(currentWeatherUrl);
      const weather = await weatherResponse.json();

      const forecastResponse = await fetch(forecastUrl);
      const forecast = await forecastResponse.json();

      displayWeather(weather);
      displayHourlyForecast(forecast.list);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Error fetching data. Please try again.");
    }
  };

  const displayWeather = (data) => {
    if (data.cod === "404") {
      alert(data.message);
      return;
    }

    const cityName = data.name;
    const temperature = Math.round(data.main.temp - 273.15);
    const description = data.weather[0].description;
    const iconCode = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

    if (description.includes("rain")) {
      setBackgroundImage("/rainy.gif"); 
    } else if (description.includes("sun") || description.includes("clear")) {
      setBackgroundImage("/sunny.jpg");
    } else if (description.includes("cloud")) {
      setBackgroundImage("/cloudy.jpg");
    } else {
      setBackgroundImage("/default.gif");
    }

    setWeatherData({
      city: cityName,
      temperature,
      description,
      iconUrl,
    });
  };

  const displayHourlyForecast = (hourlyData) => {
    const next24Hours = hourlyData.slice(0, 8);
    setForecastData(next24Hours);
  };

  return (
    <div className="app" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div id="weather-container">
        <h2>Weather App</h2>
        <input
          type="text"
          id="city"
          placeholder="Enter city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button onClick={getWeather}>Search</button>

        {weatherData && (
          <>
            <img
              id="weather-icon"
              src={weatherData.iconUrl}
              alt="Weather Icon"
            />
            <div id="temp-div">
              <p>{weatherData.temperature}°C</p>
            </div>
            <div id="weather-info">
              <p>{weatherData.city}</p>
              <p>{weatherData.description}</p>
            </div>
          </>
        )}

        {forecastData && (
          <div id="hourly-forecast">
            {forecastData.map((item, index) => {
              const dateTime = new Date(item.dt * 1000);
              const hour = dateTime.getHours();
              const temperature = Math.round(item.main.temp - 273.15);
              const iconCode = item.weather[0].icon;
              const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

              return (
                <div key={index} className="hourly-item">
                  <span>{hour}:00</span>
                  <img src={iconUrl} alt="Hourly Weather Icon" />
                  <span>{temperature}°C</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
