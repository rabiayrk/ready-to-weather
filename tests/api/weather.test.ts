import { NextRequest } from 'next/server'; 
import { getServerSession } from 'next-auth';
import * as weatherApiHandler from '@/app/api/weather/route';
import { getForecastForCity } from '@/services/weatherService';
import { db } from '@/lib/db';

const mockedGetServerSession = getServerSession as jest.Mock;
const mockedGetForecastForCity = getForecastForCity as jest.Mock;
const mockedDbWeatherQueryCreate = db.weatherQuery.create as jest.Mock;

describe('/api/weather POST', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should return 401 Unauthorized if no session is found', async () => {
    mockedGetServerSession.mockResolvedValue(null);

    const req = new NextRequest('http://localhost:3000/api/weather', {
      method: 'POST',
      body: JSON.stringify({ city: 'London' }),
    });

    const response = await weatherApiHandler.POST(req);

    expect(response.status).toBe(401);
  });

  it('should return 200 and weather data for an authenticated user', async () => {
    const mockSession = { user: { id: 'test-user-123', role: 'USER' } };
    mockedGetServerSession.mockResolvedValue(mockSession);

    const mockWeatherData = { city_name: 'London', current: { temp: 15 } };
    mockedGetForecastForCity.mockResolvedValue(mockWeatherData);

    mockedDbWeatherQueryCreate.mockResolvedValue({});

    const req = new NextRequest('http://localhost:3000/api/weather', {
      method: 'POST',
      body: JSON.stringify({ city: 'London' }),
    });

    const response = await weatherApiHandler.POST(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.city_name).toBe('London');
    expect(mockedGetForecastForCity).toHaveBeenCalledWith('London', 'metric', 'en');
    expect(mockedDbWeatherQueryCreate).toHaveBeenCalledWith({
      data: expect.objectContaining({
        userId: 'test-user-123',
        city: 'London',
      }),
    });
  });

  it('should return 404 if the weather service throws a "not found" error', async () => {
    const mockSession = { user: { id: 'test-user-123', role: 'USER' } };
    mockedGetServerSession.mockResolvedValue(mockSession);

    mockedGetForecastForCity.mockRejectedValue(new Error('City not found'));

    const req = new NextRequest('http://localhost:3000/api/weather', {
      method: 'POST',
      body: JSON.stringify({ city: 'InvalidCity' }),
    });

    const response = await weatherApiHandler.POST(req);

    expect(response.status).toBe(404);
  });
});