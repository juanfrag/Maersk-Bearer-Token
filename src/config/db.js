const Sequelize = require('sequelize');
db = {}
// Option 1: Passing parameters separately
const sequelize = new Sequelize('ebdb', 'cargofive', 'C4rg05.2018#*', {
    host: 'cfive-dev.cjmsjfgiwnzb.eu-central-1.rds.amazonaws.com',
    dialect: 'mysql',

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
})
db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db
