const Sequelize = require('sequelize');
db = {}
// Option 1: Passing parameters separately
const sequelize = new Sequelize('cargofive', 'root', '123', {
    host: 'localhost',
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
