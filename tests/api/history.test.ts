import { getServerSession } from 'next-auth';
import * as historyApiHandler from '@/app/api/weather/history/route';
import { db } from '@/lib/db';

const mockedGetServerSession = getServerSession as jest.Mock;
const mockedDbWeatherQueryFindMany = db.weatherQuery.findMany as jest.Mock;

describe('/api/weather/history GET', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should return 401 Unauthorized if no session is found', async () => {
    mockedGetServerSession.mockResolvedValue(null);

    const response = await historyApiHandler.GET();

    expect(response.status).toBe(401);
  });

  it('should return 200 and the users history for an authenticated user', async () => {
    const mockSession = { user: { id: 'test-user-123', role: 'USER' } };
    mockedGetServerSession.mockResolvedValue(mockSession);

    const mockHistory = [{ city: 'London', temperature: 15 }];
    mockedDbWeatherQueryFindMany.mockResolvedValue(mockHistory);

    const response = await historyApiHandler.GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual(mockHistory);
    expect(mockedDbWeatherQueryFindMany).toHaveBeenCalledWith({
      where: { userId: 'test-user-123' },
      orderBy: { createdAt: 'desc' },
    });
  });
});