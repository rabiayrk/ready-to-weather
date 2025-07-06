import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== 'ADMIN') {
      return new NextResponse('Forbidden', { status: 403 });
    }

    const allHistory = await db.weatherQuery.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(allHistory);

  } catch (error) {
    console.error('[ADMIN_HISTORY_GET_ERROR]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}