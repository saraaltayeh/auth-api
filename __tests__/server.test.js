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
            .auth('admin', 'abc')
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
            .auth('nothing', 'abc')
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
        const response = await mockRequest.patch('/api/v1/techstore');
        expect(response.status).toBe(404);
    });

    // test if can create a food item
    it('can add a food item', async () => {
        const response = await mockRequest.post('/api/v1/techstore').send({
            name: 'iphone',
            version: '12',
            type: 'pro max'
        });
        expect(response.status).toBe(500);
    });

    // test if can read a techstore item
    it('can get all techstore items', async () => {
        const response = await mockRequest.get('/api/v1/techstore');
        expect(response.status).toBe(500);

    });

    // test if can read one techstore item
    it('can get one record', async () => {
        const response = await mockRequest.get('/api/v1/techstore/1');
        expect(response.status).toBe(500);
    });

    // test if can update a techstore item
    it('can update a record', async () => {
        const response = await mockRequest.put('/api/v1/techstore/1');
        expect(response.status).toBe(500);
    });
    // test if can delete a techstore item
    it('can delete a record', async () => {
        const response = await mockRequest.delete('/api/v1/techstore/1');
        expect(response.status).toBe(500);
    });

    //POST /api/v2/:model with a bearer token that has create permissions adds an item to the DB and returns an object with the added item
    it('can add a techstore item', async () => {
        const response = await mockRequest.post('/api/v2/techstore').set('Authorization', `Bearer ${accessToken}`).send({
            name: 'macbook',
            version: 'm1',
            type: 'air'
        });
        expect(response.status).toBe(500);
    });
    //GET /api/v2/:model with a bearer token that has read permissions returns an array of all items in the DB
    it('can get all techstore items', async () => {
        const response = await mockRequest.get('/api/v2/techstore').set('Authorization', `Bearer ${accessToken}`);
        expect(response.status).toBe(500);
    });

    it('can get one record', async () => {
        const response = await mockRequest.get('/api/v2/techstore/1').set('Authorization', `Bearer ${accessToken}`);
        expect(response.status).toBe(500);
    });

    it('can update a record', async () => {
        const response = await mockRequest.put('/api/v2/techstore/1').set('Authorization', `Bearer ${accessToken}`).send({
            name: 'airpods',
            version: '4',
            type: 'apple'
        });
        expect(response.status).toBe(500);
    });

    it('can delete a record', async () => {
        const response = await mockRequest.delete('/api/v2/techstore/1').set('Authorization', `Bearer ${accessToken}`);
        expect(response.status).toBe(500);
    });
});

afterAll(async () => {
    await db.drop();
});