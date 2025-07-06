'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface WeatherData {
  city_name: string;
  current: {
    main: {
      temp: number;
    };
    weather: {
      icon: string;
      description: string;
    }[];
  };
  daily: {
    dt: number;
    main: {
      temp: number;
    };
    weather: {
      icon: string;
    }[];
  }[];
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/signin');
    }
  }, [status, router]);

  if (status === 'loading' || status === 'unauthenticated') {
    return <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white">Loading...</div>;
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setWeatherData(null);

    try {
      const response = await fetch(`/api/weather`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ city }),
      });

      if (!response.ok) {
        const err = await response.text();
        throw new Error(err || 'Failed to fetch weather data.');
      }

      const data = await response.json();
      setWeatherData(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4 text-white sm:p-8">
      <div className="mx-auto max-w-4xl">
      <header className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Weather Dashboard</h1>
        <p className="text-gray-300">Signed in as {session?.user?.email}</p>
      </header>

        <form onSubmit={handleSearch} className="mb-8 flex gap-2">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city name..."
            required
            className="flex-grow rounded-md border-gray-700 bg-gray-800 px-4 py-2 text-white placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-md border border-transparent bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-2 font-medium text-white shadow-sm hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50">
            {loading ? '...' : 'Search'}
          </button>
        </form>

        {error && <p className="text-center text-red-500">{error}</p>}

        {weatherData && (
          <div className="space-y-8">
            <div className="rounded-lg bg-gray-800/50 p-6 shadow-lg backdrop-blur-sm">
              <h2 className="text-3xl font-bold">{weatherData.city_name}</h2>
              <div className="mt-4 flex items-center gap-4">
                <img
                  src={`http://openweathermap.org/img/wn/${weatherData.current.weather[0].icon}@2x.png`}
                  alt="weather icon"
                  className="h-20 w-20"
                />
                <div>
                  <p className="text-6xl font-light">
                    {Math.round(weatherData.current.main.temp)}°
                  </p>
                  <p className="capitalize text-gray-400">
                    {weatherData.current.weather[0].description}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-gray-800/50 p-6 shadow-lg backdrop-blur-sm">
              <h3 className="mb-4 text-xl font-semibold">5-Day Forecast</h3>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
                {weatherData.daily.map((day) => (
                  <div key={day.dt} className="flex flex-col items-center rounded-md bg-gray-700/50 p-3">
                    <p className="font-medium">
                      {new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' })}
                    </p>
                    <img
                      src={`http://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
                      alt="weather icon"
                      className="my-1 h-12 w-12"
                    />
                    <p className="text-lg font-bold">{Math.round(day.main.temp)}°</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}