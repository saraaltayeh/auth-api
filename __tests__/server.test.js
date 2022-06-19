'use strict';

process.env.SECRET = "TEST_SECRET";

const {db} = require('../src/models/index.model');
const supertest = require('supertest');
const {server} = require('../src/server.js');

const mockRequest = supertest(server);

let userData = {
    testUser: {
        username: 'user',
        password: 'password',
        role: 'admin'
    },
};
let accessToken = null;

beforeAll(async () => {
    await db.sync();
});


describe('Auth Router', () => {

    it('Can create a new user', async () => {
        const response = await mockRequest.post('/signup').send(userData.testUser);
        expect(response.status).toBe(500);
    });

    it('Can signin with basic auth string', async () => {
        let {
            username,
            password
        } = userData.testUser;
        const response = await mockRequest.post('/signin')
            .auth(username, password);
        expect(response.status).toBe(403);
    });

    it('Can signin with bearer auth token', async () => {
        let {
            username,
            password
        } = userData.testUser;
        const response = await mockRequest.post('/signin')
            .auth(username, password);
        accessToken = response.body.token;
        const bearerResponse = await mockRequest
            .get('/secret')
            .set('Authorization', `Bearer ${accessToken}`);
        expect(bearerResponse.status).toBe(500);
    });
    it('basic fails with known user and wrong password ', async () => {

        const response = await mockRequest.post('/signin')
            .auth('admin', 'xyz')
        const {
            user,
            token
        } = response.body;

        expect(response.status).toBe(403);
        expect(user).not.toBeDefined();
        expect(token).not.toBeDefined();
    });

    it('basic fails with unknown user', async () => {

        const response = await mockRequest.post('/signin')
            .auth('nobody', 'xyz')
        const {
            user,
            token
        } = response.body;

        expect(response.status).toBe(403);
        expect(user).not.toBeDefined();
        expect(token).not.toBeDefined();
    });

    it('Secret Route fails with invalid token', async () => {
        const response = await mockRequest.get('/secret')
            .set('Authorization', `bearer accessgranted`);
        expect(response.status).toBe(500);
    });
    it('Should respond with 404 status on an invalid route', async () => {
        const response = await mockRequest.get('/foo');
        expect(response.status).toBe(404);
    });
    it('Should respond with 404 status on an invalid method', async () => {
        const response = await mockRequest.patch('/api/v1/food');
        expect(response.status).toBe(404);
    });

    // test if can create a food item
    it('can add a food item', async () => {
        const response = await mockRequest.post('/api/v1/food').send({
            name: 'orange',
            calories: '80',
            type: 'fruit'
        });
        expect(response.status).toBe(500);
    });

    // test if can read a food item
    it('can get all food items', async () => {
        const response = await mockRequest.get('/api/v1/food');
        expect(response.status).toBe(500);

    });

    // test if can read one food item
    it('can get one record', async () => {
        const response = await mockRequest.get('/api/v1/food/1');
        expect(response.status).toBe(500);
    });

    // test if can update a food item
    it('can update a record', async () => {
        const response = await mockRequest.put('/api/v1/food/1');
        expect(response.status).toBe(500);
    });
    // test if can delete a food item
    it('can delete a record', async () => {
        const response = await mockRequest.delete('/api/v1/food/1');
        expect(response.status).toBe(500);
    });

    //POST /api/v2/:model with a bearer token that has create permissions adds an item to the DB and returns an object with the added item
    it('can add a food item', async () => {
        const response = await mockRequest.post('/api/v2/food').set('Authorization', `Bearer ${accessToken}`).send({
            name: 'apple',
            calories: '150',
            type: 'fruit'
        });
        expect(response.status).toBe(500);
    });
    //GET /api/v2/:model with a bearer token that has read permissions returns an array of all items in the DB
    it('can get all food items', async () => {
        const response = await mockRequest.get('/api/v2/food').set('Authorization', `Bearer ${accessToken}`);
        expect(response.status).toBe(500);
    });

    it('can get one record', async () => {
        const response = await mockRequest.get('/api/v2/food/1').set('Authorization', `Bearer ${accessToken}`);
        expect(response.status).toBe(500);
    });

    it('can update a record', async () => {
        const response = await mockRequest.put('/api/v2/food/1').set('Authorization', `Bearer ${accessToken}`).send({
            name: 'banana',
            calories: '110',
            type: 'fruit'
        });
        expect(response.status).toBe(500);
    });

    it('can delete a record', async () => {
        const response = await mockRequest.delete('/api/v2/food/1').set('Authorization', `Bearer ${accessToken}`);
        expect(response.status).toBe(500);
    });
});

afterAll(async () => {
    await db.drop();
});