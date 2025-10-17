"use client";

import { getWeatherIcon } from "@/app/_lib/helpers/functions";
import { useEffect, useState } from "react";

// lat / lon si zmeň podľa okresu alebo mesta
const LAT = 49.0889; // 49° 05′ 20″ N
const LON = 18.6372; // 18° 38′ 14″ E

export default function MobileWeatherCard() {
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
      <div className="text-md mr-10 self-end p-4 font-bold italic text-primary-300">
        Načítavam počasie…
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
    <>
      <button
        onClick={handleClick}
        className="flex w-full items-center justify-end gap-2 rounded-2xl md:hidden md:px-8"
      >
        <div className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-tr from-blue-300 to-blue-600 p-2 px-3 text-white shadow-md md:p-4">
          <div className="text-2xl md:text-4xl">{icon}</div>
          <div className="text-md font-medium md:text-lg">
            {todayTempMax} °C / {todayTempMin} °C
          </div>
        </div>
      </button>

      {/* Týždeň */}
      {/* <div className="space-y-2 p-4 py-6 text-sm text-gray-600" >
          {
            week.map((d) => (
              <div key={d.date} className="flex justify-between">
                <span>
                  {new Date(d.date).toLocaleDateString("sk-SK", {
                    weekday: "short",
                  })}
                </span>
                <span>
                  {d.max} / {d.min} °C
                </span>
              </div>)
            )
          }

        </div > */}
    </>
  );
}
