import 'whatwg-fetch';

jest.mock('./src/lib/db', () => ({
  __esModule: true,
  db: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    weatherQuery: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
  },
}));

jest.mock('@next-auth/prisma-adapter')
jest.mock('next-auth');
jest.mock('bcrypt');

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashed_password'),
}));

jest.mock('./src/services/weatherService');


jest.mock('./src/services/weatherService', () => ({
  getForecastForCity: jest.fn(),
}));