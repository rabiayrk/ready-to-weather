import { getServerSession } from 'next-auth';
import * as adminUsersApiHandler from '@/app/api/admin/users/route';
import * as adminHistoryApiHandler from '@/app/api/admin/weather/history/route';
import { db } from '@/lib/db';

const mockedGetServerSession = getServerSession as jest.Mock;
const mockedDbUserFindUnique = db.user.findUnique as jest.Mock;
const mockedDbUserCreate = db.user.create as jest.Mock;
const mockedDbWeatherQueryFindMany = db.weatherQuery.findMany as jest.Mock;

describe('/api/admin/', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('Users endpoint', () => {
    it('should return 403 Forbidden if user is not an admin', async () => {
      mockedGetServerSession.mockResolvedValue({ user: { role: 'USER' } });
      const req = new Request('http://localhost:3000/api/admin/users', {
        method: 'POST',
        body: JSON.stringify({ email: 'rabianew@gmail.com', password: 'admin456' }),
      });
      const response = await adminUsersApiHandler.POST(req);
      expect(response.status).toBe(403);
    });

    it('should return 409 Conflict if user already exists', async () => {
      mockedGetServerSession.mockResolvedValue({ user: { role: 'ADMIN' } });
      mockedDbUserFindUnique.mockResolvedValue({ id: '123', email: 'rabiayrk@gmail.com' });
      
      const req = new Request('http://localhost:3000/api/admin/users', {
        method: 'POST',
        body: JSON.stringify({ email: 'rabiayrk@gmail.com', password: 'admin123' }),
      });
      
      const response = await adminUsersApiHandler.POST(req);
      expect(response.status).toBe(409);
    });

    it('should return 201 and create a user if request is valid and user is admin', async () => {
      mockedGetServerSession.mockResolvedValue({ user: { role: 'ADMIN' } });
      mockedDbUserFindUnique.mockResolvedValue(null);
      const newUser = { id: 'new-user', email: 'rabianew@gmail.com', role: 'USER' };
      mockedDbUserCreate.mockResolvedValue(newUser);
      
      const req = new Request('http://localhost:3000/api/admin/users', {
        method: 'POST',
        body: JSON.stringify({ email: 'rabianew@gmail.com', password: 'admin123' }),
      });

      const response = await adminUsersApiHandler.POST(req);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data).toEqual(newUser);
    });
  });

  describe('Weather History endpoint', () => {
     it('should return 403 Forbidden if user is not an admin', async () => {
      mockedGetServerSession.mockResolvedValue({ user: { role: 'USER' } });
      const response = await adminHistoryApiHandler.GET();
      expect(response.status).toBe(403);
    });
    
     it('should return 200 and all history if user is admin', async () => {
      mockedGetServerSession.mockResolvedValue({ user: { role: 'ADMIN' } });
      const mockHistory = [{ city: 'Paris' }, { city: 'Tokyo' }];
      mockedDbWeatherQueryFindMany.mockResolvedValue(mockHistory);
      
      const response = await adminHistoryApiHandler.GET();
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data).toEqual(mockHistory);
    });
  });
});