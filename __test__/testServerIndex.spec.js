const server = require ('../src/server/index') //to import the server/index.js to test

const supertest = require('supertest');
const request = supertest(server);


describe('Testing if the server path is running', () => {
    test('Testing server status code response', async () => {
        const response = await request('http://localhost:8000').get('/');
        expect(response.statusCode).toBe(200);
        console.log("::: STATUS CODE 200: OK :::")
    });
});




