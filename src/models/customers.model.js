'use strict';

const customersModel = (sequelize, DataTypes) =>
    sequelize.define('customers_table', {
        name: {
            type: DataTypes.STRING,
            required: true,
        },
        age: {
            type: DataTypes.INTEGER,
            required: true,
        },
        mobile: {
            type: DataTypes.INTEGER,
            required: true,
        }
    });

module.exports = customersModel;