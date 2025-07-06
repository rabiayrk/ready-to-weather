import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { getForecastForCity } from '@/services/weatherService';
import { db } from '@/lib/db';
import { Prisma } from '@prisma/client';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const unit = searchParams.get('unit') === 'fahrenheit' ? 'imperial' : 'metric';
    const lang = searchParams.get('lang') || 'en';

    const body = await req.json();
    const { city } = body;

    if (!city) {
      return new NextResponse('City is required', { status: 400 });
    }

    const forecastData = await getForecastForCity(city, unit, lang);

    await db.weatherQuery.create({
      data: {
        city: forecastData.city_name,
        temperature: forecastData.current.main.temp, 
        unit: unit === 'imperial' ? 'Fahrenheit' : 'Celsius',
        details: forecastData as unknown as Prisma.InputJsonObject,
        userId: session.user.id,
      },
    });

    return NextResponse.json(forecastData);

  } catch (error: any) {
    console.error('[WEATHER_FORECAST_API_ERROR]', error);
    if (error.message.includes('not found') || error.message.includes('Could not find')) {
      return new NextResponse(error.message, { status: 404 });
    }
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}