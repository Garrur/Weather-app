import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import clearIcon from "../assets/svgsvg/day.svg";
import rainIcon from "../assets/svgsvg/rainy.svg";
import cloudsIcon from "../assets/svgsvg/cloudy.svg";
import drizzleIcon from "../assets/svgsvg/drizzle.svg";

import axios from "axios";


 const ForeCast = () => {
    const [foreCastData, setForeCastData] = useState([])
    const [loading, setLoading] = useState(true)
    const { cityName } = useParams();



    useEffect(() => {
        const fetchForeCastData = async () => {
          try {
            const response = await axios.get(
              `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${import.meta.env.VITE_WETAPI_Key}`
            );
            const dailyForecasts = response.data.list.filter((item, index) =>index % 8 ===0)
            setForeCastData(dailyForecasts);
            setLoading(false)
            console.log(dailyForecasts);
          } catch (error) {
            console.log("Fetching Error",error);
            setLoading(false)

          } 
        };
        fetchForeCastData();
      }, [cityName]);

//icons




      

  return (
    <div className=" p-2">
        <h1 className=" text-center text-slate-600 text-3xl font-bold underline mb-4 ">Forecast</h1>{
            loading ?(
                <p>Loading...</p>
            ):(
                <div className=" flex xl:gap-5 flex-col xl:flex-row ">
                    {
                        foreCastData.map((day, index)=>{
                            let weatherIcon;
                            if(day.weather[0].main === "Clouds"){
                                weatherIcon = cloudsIcon
                            }else if(day.weather[0].main === "Rain"){
                                weatherIcon = rainIcon
                            }else if(day.weather[0].main === "Clear"){
                                weatherIcon = clearIcon
                            }else if(day.weather[0].main === "Drizzle"){
                                weatherIcon = drizzleIcon
                            }

                            //extracting date

                            const date = new Date(day.dt_txt)
                            const option = {weekday:"long", year:"numeric", month:"long", day:"numeric"}
                            const forecastDate = date.toLocaleDateString('en-US', option)

                            return (
                                <>
                                    <div className=" border border-black border-y-4 bg-slate-300 shadow-lg">
                                        <div key ={index} className="flex flex-col xl:gap-2 items-center text-black">
                                            <p className="font-semibold">{forecastDate}</p>
                                            <img src={weatherIcon} alt='cloud' />
                                            <p className="font-semibold">{(day.main.temp- 273.15).toFixed(1)}°c </p>
                                            <p></p>
                                        </div>
                                    </div>
                                </>
                            )
                            
                        })
                    }
                </div>
            )
        }
    </div>
  )
}

export default ForeCast ;