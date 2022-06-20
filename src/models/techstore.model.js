'use strict';

const techStoreModel = (sequelize, DataTypes) =>
    sequelize.define('techStore_table', {
        name: {
            type: DataTypes.STRING,
            required: true
        },
        version: {
            type: DataTypes.STRING,
            required: true
        },
        type: {
            type: DataTypes.STRING,
            required: true
        }
    });

module.exports = techStoreModel;