import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import WeatherSkeleton from "../skeleton/skeleton";

import clear from "../assets/clear.jpg";
import cloudyBackground from "../assets/cloud.jpg";
import drizzleBackground from "../assets/drizzle.jpg";
import rainyBackground from "../assets/rain.jpg";
import sunnyBackground from "../assets/sunny.jpg";

// Import SVG icons for different weather conditions
import clearIcon from "../assets/svgsvg/day.svg";
import rainIcon from "../assets/svgsvg/rainy.svg";
import cloudsIcon from "../assets/svgsvg/cloudy.svg";
import drizzleIcon from "../assets/svgsvg/drizzle.svg";
import ForeCast from "./ForeCast";


const api_key = import.meta.env.VITE_WETAPI_Key;

export const WeatherPage = () => {
  const [weatherdata, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { cityName } = useParams();

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${api_key}`
        );
        setWeatherData(response.data);
      } catch (error) {
        setError("Failed to fetch weather data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchWeatherData();
  }, [cityName]);

  const selectBackground = () => {
    if (weatherdata && weatherdata.weather && weatherdata.weather.length > 0) {
      switch (weatherdata.weather[0].main) {
        case 'Clear':
          return sunnyBackground;
        case 'Rain':
          return rainyBackground;
        case 'Clouds':
          return cloudyBackground;
        case 'Drizzle':
          return drizzleBackground;
        default:
          return clear;
      }
    } else {
      return clear;
    }
  };

  const selectIcon = () => {
    if (weatherdata && weatherdata.weather && weatherdata.weather.length > 0) {
      switch (weatherdata.weather[0].main) {
        case 'Clear':
          return clearIcon;
        case 'Rain':
          return rainIcon;
        case 'Clouds':
          return cloudsIcon;
        case 'Drizzle':
          return drizzleIcon;
        default:
          return clearIcon;
      }
    } else {
      return clearIcon;
    }
  };

  return (
    <div>
      <div className="min-h-screen flex items-center justify-center gap-5 flex-col sm:flex-row xl:flex-col" style={{ backgroundImage: `url(${selectBackground()})` }}>
        {loading && <WeatherSkeleton />}
        {weatherdata && !error && !loading && (
          <div className="flex flex-col bg-white rounded p-4 w-full max-w-xs shadow-2xl border-2 hover:bg-slate-100">
            <div className="font-bold text-xl">{cityName}</div>
            <div className="text-sm text-gray-500">{new Date().toDateString()}</div>
            <div className="mt-6 text-6xl self-center inline-flex items-center justify-center rounded-lg text-indigo-400 h-full w-full">
              
             <img src={selectIcon()} alt="Weather Icon"  className="w-24 h-24"/>
              
            </div>
            <div className="flex flex-row items-center justify-center mt-6">
              {weatherdata && !error && (
                <>
                  <div className="font-medium text-6xl">{(weatherdata.main.temp - 273.15).toFixed(1)}°c</div>
                  <div className="flex flex-col items-center ml-6 font-bold">
                    <div>{weatherdata.weather[0].main}</div>
                    <div className="mt-1">
                      <span className="text-sm"><i className="far fa-long-arrow-up" /></span>
                      <span className="text-sm font-light text-gray-700">Max - ({(weatherdata.main.temp_max - 273.15).toFixed(1)}°c) </span>
                    </div>
                    <div>
                      <span className="text-sm"><i className="far fa-long-arrow-down" /></span>
                      <span className="text-sm font-light text-gray-700">Min - ( {(weatherdata.main.temp_min - 273.15).toFixed(1)}°c)  </span>
                    </div>
                  </div>
                </>
              )}
            </div>
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
        {error && !loading && <div>{error}</div>}
        
        <ForeCast />
      </div>
    </div>
  );
};
