const app = require ('../src/server/index') //to import the server/index.js to test

const supertest = require('supertest');
const request = supertest(app);


describe("Testing if the server path is running", () => {
    it("Testing server status code response", async () => {
      const response = await request.get("/update");
        expect(response.statusCode).toBe(200);
        console.log("::: STATUS CODE 200: OK :::")

    });
  });