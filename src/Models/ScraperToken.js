const Sequelize = require('sequelize');
const db = require('../config/db.js');

module.exports = db.sequelize.define(
    'scrapers_tokens',
    {
        // attributes
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: false
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        token: {
            type: Sequelize.STRING,
            allowNull: false
        }
        //created_at: Sequelize.DATE,
        //updated_at: Sequelize.DATE,
    },
    {
        timestamp:true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
)