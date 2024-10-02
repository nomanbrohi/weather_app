"use client"; // enables client side rendering
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import "boxicons/css/boxicons.min.css";
import { MapPinIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { useState, ChangeEvent } from "react";
import axios from "axios";

interface WeatherData {
  name: string;
  main: {
    temp: number;
    humidity: number;
  };
  weather: [
    {
      description: string;
      main: string;
    }
  ];
  wind: {
    speed: string;
  };
}

export default function WeatherApp() {
  const [error, setError] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [weather, setWeather] = useState<WeatherData | null>(null);

  const weatherImage = () => {
    if (weather?.weather[0].main === "Rain") {
      return <Image src="/images/rain.png" width={180} height={180} alt="rainy" />;
    } else if (weather?.weather[0].main === "Clear") {
      return <Image src="/images/clear.png" width={180} height={180} alt="Clear" />;
    } else if (weather?.weather[0].main === "Clouds") {
      return <Image src="/images/cloud.png" width={180} height={180} alt="cloudy" />;
    } else if (weather?.weather[0].main === "Mist" || weather?.weather[0].main === "Haze") {
      return <Image src="/images/mist.png" width={180} height={180} alt="mist" />;
    } else if (weather?.weather[0].main === "Snow") {
      return <Image src="/images/snow.png" width={180} height={180} alt="snow" />;
    }

    return null;
  };

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    setCity(e.target.value);
  };
  const fetchWeather = async () => {
    if (!city) {
      setError("Please Enter the City Name.");
      return;
    }
    setError("");

    try {
      const weatherApi = "085aa12dc2c23353736b9f6ca156dae2";
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${weatherApi}`
      );
      setWeather(response.data);
    } catch {
      setError("Could not fetch weather data. Please check the city name.");
      setWeather(null);
    }
  };

  return (
    <main>
      <div
        className="w-full h-screen flex flex-col justify-center items-center bg-cover bg-center"
        style={{ backgroundImage: "url('/images/background.jpg')" }}
      >
          {/* child Div */}
          <h1 className="text-white font-bold pb-10 text-3xl uppercase text-center">
            Weather App
          </h1>
        {/* parent Div */}
        <div
          className={`bg-white/[.3] backdrop-blur-xl relative w-[300px] sm:w-[400px] p-5 rounded-2xl border-2 border-solid border-inherit transition-all duration-500 ${weather ? "h-[555px]" : "h-[100px]"} ${error ? "h-[auto]" : "h-[100px]"}`}
        >
          <div className="relative w-full h-14 flex items-center bg-transparent">
            <MapPinIcon className="absolute left-2 w-5 h-5 text-white" />
            <input
              className=" absolute w-[100%] h-full bg-transparent border-2 border-solid border-[rgba(255,255,255,.1)] outline-none rounded-xl text-sm text-white font-bold uppercase pr-12 pl-11 placeholder:text-white "
              placeholder="Enter Location"
              type="text"
              onChange={handleInput}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  fetchWeather();
                }
              }}
            ></input>
            <button
              type="button"
              onClick={fetchWeather} // Trigger the fetchWeather function
              className="absolute right-0 w-10 h-24 text-3xl cursor-pointer"
            >
              <MagnifyingGlassIcon className="w-5 h-5 text-white" />
            </button>
          </div>
          {/* Show Weather Info */}
          {weather && (
            <div className="mt-10 flex flex-col items-center">
              <div className="w-[100px] h-[100px] sm:w-[180px] sm:h-[180px]">{weatherImage()}</div>
              <p className="relative sm:text-[64px] text-[34px] text-white leading-[1] font-bold sm:mt-5 mt-2 mb-2 ml-[-30]">
                {weather.main.temp}
                <span className="absolute text-[24px] ml-1">°C</span>
              </p>
              <p className="text-2xl font-medium text-white capitalize">
                {weather.weather[0].main}
              </p>
              <div className="flex justify-between items-center w-full text-2xl font-medium text-white capitalize mt-10">
                <div className="sm:flex flex:col justify-center gap-2">
                  <i className="bx bx-water bx-rotate-45 text-4xl"></i>
                  <p>
                    {weather.main.humidity}
                    <span>%</span>
                  </p>
                </div>
                <div className="sm:flex flex:col text-center sm:justify-center gap-2">
                  <i className="bx bx-wind bx-rotate-45 text-4xl"></i>
                  <p>
                    {weather.wind.speed}
                    <span className="sm:text-2xl text-[14px] ">km/h</span>
                  </p>
                </div>
              </div>
            </div>
          )}
          {error && (
            <div>
              {/* <h1>{weather.name}</h1> */}
              <p>{error}</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
