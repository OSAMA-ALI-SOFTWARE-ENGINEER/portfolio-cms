const request = require('supertest');
const app = require('../server');
const db = require('../config/db');

describe('API Health Check', () => {
  it('should return 404 for unknown route', async () => {
    const res = await request(app).get('/api/unknown');
    expect(res.statusCode).toEqual(404);
  });

  it('should have database connection', async () => {
    const [rows] = await db.query('SELECT 1');
    expect(rows).toBeDefined();
  });

  it('should return 200 for GET /api/blogs', async () => {
    const res = await request(app).get('/api/blogs');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body.data)).toBeTruthy();
  });

  it('should return 200 for GET /api/visitors/stats', async () => {
    const res = await request(app).get('/api/visitors/stats');
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
  });
});

afterAll(async () => {
  await db.close();
});
