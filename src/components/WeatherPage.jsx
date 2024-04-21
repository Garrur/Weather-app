import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import WeatherSkeleton from "../skeleton/skeleton";
import { WiDaySunny, WiRain, WiCloudy, WiShowers } from 'react-icons/wi';

import sunnyBackground from "../assets/sunny.jpg";
import rainyBackground from "../assets/rain.jpg";
import cloudyBackground from "../assets/cloud.jpg";
import drizzleBackground from "../assets/drizzle.jpg";
import clear from "../assets/clear.jpg"

const api_key = import.meta.env.VITE_WETAPI_Key;

export const WeatherPage = () => {
  const [weatherdata, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // State to track loading status
  const { cityName } = useParams();

  useEffect(() => {
    const fetchWeatherData = async () => {
      console.log("Fetching weather data for:", cityName);
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${api_key}`
        );
        setWeatherData(response.data);
      } catch (error) {
        setError("Failed to fetch weather data. Please try again.");
      } finally {
        setLoading(false); // Set loading to false when the request is completed
      }
    };
    fetchWeatherData();
  }, [cityName]);

  const selectBackground = () => {
    console.log("Weather Data:", weatherdata);
  
    if (weatherdata && weatherdata.weather && weatherdata.weather.length > 0) {
      console.log("Weather Condition:", weatherdata.weather[0].main);
  
      switch (weatherdata.weather[0].main) {
        case 'Clear':
          console.log("Selected Background: Sunny");
          return sunnyBackground;
        case 'Rain':
          console.log("Selected Background: Rainy");
          return rainyBackground;
        case 'Clouds':
          console.log("Selected Background: Cloudy");
          return cloudyBackground;
        case 'Drizzle':
          console.log("Selected Background: Drizzle");
          return drizzleBackground;
        default:
          console.log("Selected Background: Default (Clear)");
          return clear; // Default background
      }
    } else {
      console.log("No weather data available.");
      return clear; // Default background if weather data is not available
    }
  };

  return (
    <div>
      

      {/* Weather information */}
      <div className="min-h-screen flex items-center justify-center " style={{ backgroundImage: `url(${selectBackground()})` }}>
        {/* Embedding the map */}
        {loading && <WeatherSkeleton />} {/* Display loading indicator */}
        {weatherdata && !error && !loading && (
          <div className="flex flex-col bg-white rounded p-4 w-full max-w-xs shadow-2xl border-2 hover:bg-sky-100">
            <div className="font-bold text-xl">{cityName}</div>
            <div className="text-sm text-gray-500">{new Date().toDateString()}</div>
            {/* Weather Icon */}
            <div className="mt-6 text-6xl self-center inline-flex items-center justify-center rounded-lg text-indigo-400 h-24 w-24">
              {/* Insert weather icon SVG here */}
              <div className="mt-6 text-6xl  w-full self-center inline-flex items-center justify-center rounded-lg text-indigo-400 h-24 w-24">
                {weatherdata.weather[0].main === 'Clear' && <WiDaySunny />}  {/* Weather icon based on condition */}
                {weatherdata.weather[0].main === 'Rain' && <WiRain />}
                {weatherdata.weather[0].main === 'Clouds' && <WiCloudy />}
                {weatherdata.weather[0].main === 'Drizzle' && <WiShowers />}
              </div>
            </div>
            {/* Weather Details */}
            <div className="flex flex-row items-center justify-center mt-6">
              {weatherdata && !error && (
                <>
                  <div className="font-medium text-6xl">{(weatherdata.main.temp - 273.15).toFixed(1)}°c</div>
                  <div className="flex flex-col items-center ml-6">
                    <div>{weatherdata.weather[0].main}</div>
                    <div className="mt-1">
                      <span className="text-sm"><i className="far fa-long-arrow-up" /></span>
                      <span className="text-sm font-light text-gray-500">Max - {(weatherdata.main.temp_max - 273.15).toFixed(1)}°c </span>
                    </div>
                    <div>
                      <span className="text-sm"><i className="far fa-long-arrow-down" /></span>
                      <span className="text-sm font-light text-gray-500">Min - {(weatherdata.main.temp_min - 273.15).toFixed(1)}°c  </span>
                    </div>
                  </div>
                </>
              )}
            </div>
            {/* Additional Weather Information */}
            <div className="flex flex-row justify-between mt-6">
              {weatherdata && !error && (
                <>
                  <div className="flex flex-col items-center">
                    <div className="font-medium text-sm">Wind</div>
                    <div className="text-sm text-gray-500">{weatherdata.wind.speed} km/h</div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="font-medium text-sm">Humidity</div>
                    <div className="text-sm text-gray-500">{weatherdata.main?.humidity} %</div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="font-medium text-sm">Pressure</div>
                    <div className="text-sm text-gray-500">{weatherdata.main?.pressure} hPa</div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
        {error && !loading && <div>{error}</div>} {/* Display error message */}
      </div>
    </div>
  );
};
