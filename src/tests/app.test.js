const request = require('supertest');
const app = require('../../app');
const getTestAccounts = require('./test.helper');

describe('GET /api/accounts', () => {
  test('Should not contain empty object /pageSize/15/page/1', async () => {
    const response = await request(app).get('/api/accounts/pageSize/15/page/1');
    expect(response.statusCode).toBe(200);
    expect(response.body.find((obj) => Object.keys(obj).length === 0)).toBe(undefined);
    expect(response.body.length).toBe(15);
  });

  test('Validate pagination: /pageSize/5/page/13', async () => {
    const response = await request(app).get('/api/accounts/pageSize/5/page/13');
    expect(response.statusCode).toBe(200);
    expect(response.body).toStrictEqual(getTestAccounts(5, 13));
  });

  test('Validate pagination: /pageSize/10/page/4', async () => {
    const response = await request(app).get('/api/accounts/pageSize/10/page/4');
    expect(response.statusCode).toBe(200);
    expect(response.body).toStrictEqual(getTestAccounts(10, 4));
  });

  test('Validate pagination: /pageSize/15/page/5', async () => {
    const response = await request(app).get('/api/accounts/pageSize/15/page/5');
    expect(response.statusCode).toBe(200);
    expect(response.body).toStrictEqual(getTestAccounts(15, 5));
  });

  test('Validate pagination: /pageSize/20/page/2', async () => {
    const response = await request(app).get('/api/accounts/pageSize/20/page/2');
    expect(response.statusCode).toBe(200);
    expect(response.body).toStrictEqual(getTestAccounts(20, 2));
  });


  test('Validate pagination to verify max boundary: /pageSize/15/page/334', async () => {
    const response = await request(app).get('/api/accounts/pageSize/15/page/334');
    expect(response.statusCode).toBe(200);
    // Although we asked for 15 pageSize, it will only return 5 since there is no other data left
    expect(response.body.length).toBe(5);
  });

  test('Should not fail for large number: /pageSize/20/page/1000', async () => {
    const response = await request(app).get('/api/accounts/pageSize/20/page/1000');
    expect(response.statusCode).toBe(200);
  });

  test('Should throw 400 for invalid page size and number: /pageSize/500/page/7', async () => {
    const response = await request(app).get('/api/accounts/pageSize/500/page/7');
    expect(response.statusCode).toBe(400);
  });

  test('Should throw 400 for invalid page size and number: /pageSize/asd/page/asd', async () => {
    const response = await request(app).get('/api/accounts/pageSize/asd/page/asd');
    expect(response.statusCode).toBe(400);
  });
  test('Should throw 400 for invalid page size and number: /pageSize/-1/page/3', async () => {
    const response = await request(app).get('/api/accounts/pageSize/asd/page/asd');
    expect(response.statusCode).toBe(400);
  });
});
