"use client";

import { getWeatherIcon } from "@/app/_lib/helpers/functions";
import { useEffect, useState } from "react";

// lat / lon si zmeň podľa okresu alebo mesta
const LAT = 49.0889; // 49° 05′ 20″ N
const LON = 18.6372; // 18° 38′ 14″ E

export default function WeatherCard() {
  const [data, setData] = useState(null); // { today, tomorrow, week }
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchWeather() {
      try {
        const url =
          `https://api.open-meteo.com/v1/forecast` +
          `?latitude=${LAT}&longitude=${LON}` +
          `&current_weather=true` +
          `&daily=weathercode,temperature_2m_max,temperature_2m_min` +
          `&timezone=Europe/Bratislava`;

        const res = await fetch(url);
        if (!res.ok) throw new Error("API error " + res.status);
        const json = await res.json();

        const d = json.daily;
        const format = (i) => ({
          date: d.time[i], // "2025-07-14"
          max: d.temperature_2m_max[i],
          min: d.temperature_2m_min[i],
          code: d.weathercode[i],
        });

        setData({
          today: format(0),
          tomorrow: format(1),
          week: d.time.map((_, i) => format(i)),
        });
      } catch (err) {
        setError(err.message);
      }
    }

    fetchWeather();
  }, []);

  /* ---------- UI ---------- */
  if (error) return <div className="p-4 text-red-600">Chyba: {error}</div>;
  if (!data)
    return (
      <div className="text-md flex w-full items-center justify-end gap-4 font-bold italic text-primary-300">
        <span className="flex items-center pr-8">Načítavam počasie…</span>
      </div>
    );

  const { today, tomorrow, week } = data;

  const todayTempMax = Math.round(today.max);
  const todayTempMin = Math.round(today.min);

  const icon = getWeatherIcon(today.code);

  function handleClick() {
    // Otvorí Google Počasie pre tvoju lokalitu (napr. Žilina)
    window.open("https://www.google.com/search?q=počasie+Žilina", "_blank");
    // Foreca - pekná modrá stránka s počasím
    // window.open("https://www.foreca.sk/Slovakia/Žilina", "_blank");
  }

  return (
    <div className="hidden w-full items-center justify-end gap-2 rounded-2xl md:flex lg:px-4">
      <button
        onClick={handleClick}
        className="rounded-full transition-transform duration-200 ease-out hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
      >
        <div className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-tr from-blue-300 to-blue-600 text-white shadow-md
        px-3 py-2
        sm:px-4 sm:py-2.5
        md:px-4 md:py-3
        lg:px-5 lg:py-3.5
        2xl:px-6 2xl:py-4"
        >
          {/* Ikona */}
          <div className="text-xl sm:text-2xl lg:text-3xl 2xl:text-4xl">{icon}</div>

          {/* Teploty */}
          <div className="whitespace-nowrap text-sm font-medium
          sm:text-base
          md:text-lg
          2xl:text-xl
          3xl:text-2xl"
          >
            {todayTempMax} °C / {todayTempMin} °C
          </div>
        </div>
      </button>

      {/* Týždeň (voliteľné) */}
      {/*
    <div className="hidden space-y-2 p-3 text-xs sm:text-sm text-gray-600">
      {week.map((d) => (
        <div key={d.date} className="flex justify-between">
          <span>
            {new Date(d.date).toLocaleDateString("sk-SK", {
              weekday: "short",
            })}
          </span>
          <span>
            {d.max} / {d.min} °C
          </span>
        </div>
      ))}
    </div>
    */}
    </div>
  );

}
