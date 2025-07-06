// src/services/weatherService.ts
import redis from '@/lib/redis';
import axios from 'axios';

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const CACHE_TTL_SECONDS = 600; // Cache for 10 minutes

export async function getForecastForCity(city: string, unit: 'metric' | 'imperial' = 'metric', lang: string = 'en'): Promise<any> {
  const cacheKey = `forecast-v2:${city.toLowerCase().replace(/ /g, '_')}:${lang}`;

  try {
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      console.log(`[Cache] HIT for forecast: ${city}`);
      let forecastData = JSON.parse(cachedData);
      if (unit === 'imperial') {
        forecastData.current.main.temp = (forecastData.current.main.temp * 9 / 5) + 32;
        forecastData.daily.forEach((day: any) => {
          day.main.temp = (day.main.temp * 9 / 5) + 32;
        });
      }
      return forecastData;
    }
  } catch (error) {
    console.error('[Redis Error]', error);
  }

  console.log(`[Cache] MISS for forecast: ${city}. Fetching from API.`);

  try {
    const currentPromise = axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
      params: { q: city, appid: OPENWEATHER_API_KEY, units: 'metric', lang }
    });
    
    const forecastPromise = axios.get(`https://api.openweathermap.org/data/2.5/forecast`, {
      params: { q: city, appid: OPENWEATHER_API_KEY, units: 'metric', lang }
    });

    const [currentResponse, forecastResponse] = await Promise.all([currentPromise, forecastPromise]);

    const dailyForecasts = [];
    const seenDays = new Set();
    for (const forecast of forecastResponse.data.list) {
      const day = new Date(forecast.dt * 1000).toISOString().split('T')[0];
      if (!seenDays.has(day) && seenDays.size < 5) {
        dailyForecasts.push(forecast);
        seenDays.add(day);
      }
    }

    const combinedData = {
      city_name: currentResponse.data.name,
      current: currentResponse.data,
      daily: dailyForecasts,
    };

    await redis.setex(cacheKey, CACHE_TTL_SECONDS, JSON.stringify(combinedData));
    
    if (unit === 'imperial') {
        combinedData.current.main.temp = (combinedData.current.main.temp * 9 / 5) + 32;
        combinedData.daily.forEach((day: any) => {
           day.main.temp = (day.main.temp * 9 / 5) + 32;
        });
    }

    return combinedData;

  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      throw new Error(`City '${city}' not found.`);
    }
    console.error('[OPENWEATHER_API_ERROR]', error);
    throw new Error('Failed to fetch weather data.');
  }
}