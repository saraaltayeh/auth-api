'use strict';
require('dotenv').config();

const {Sequelize,DataTypes} = require('sequelize');
const techstoreModel = require('./techstore.model');
const customersModel = require('./customers.model');
const Collection = require('./data-collection.js');
const userModel = require('../auth/models/users-model');

const DATABASE_URL = process.env.NODE_ENV === 'test' ? 'sqlite::memory' : process.env.DATABASE_URL;
const DATABASE_CONFIG = process.env.NODE_ENV === 'production' ? {
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false,
        }

    }
} : {};

const sequelize = new Sequelize(DATABASE_URL, DATABASE_CONFIG);

const customers = customersModel(sequelize, DataTypes);
const techstore = techstoreModel(sequelize, DataTypes);

module.exports = {
    db: sequelize,
    customers: new Collection(customers),
    techstore: new Collection(techstore),
    users: userModel(sequelize, DataTypes),
};