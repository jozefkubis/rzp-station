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
  if (!data) return <div className="p-4">Načítavam počasie…</div>;

  const { today, tomorrow, week } = data;

  const icon = getWeatherIcon(today.code);

  return (
    <div className="w-full space-y-4 rounded-2xl bg-white p-4 shadow">
      <h2 className="text-lg font-semibold">
        Počasie – Rajec <span className="text-4xl">{icon}</span>
      </h2>

      {/* Dnes */}
      <div className="flex justify-between">
        <span>Dnes</span>
        <span className="font-medium">
          {today.max} °C / {today.min} °C
        </span>
      </div>

      {/* Zajtra */}
      <div className="flex justify-between">
        <span>Zajtra</span>
        <span className="font-medium">
          {tomorrow.max} °C / {tomorrow.min} °C
        </span>
      </div>

      {/* Týždeň */}
      <div className="space-y-1 border-t pt-2 text-sm text-gray-600">
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
    </div>
  );
}
