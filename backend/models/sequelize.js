// sequelize.js
const { Sequelize } = require('sequelize');

// Create a new Sequelize instance
const sequelize = new Sequelize('mysql://user:password@localhost:3306/reservation_system');

// Export the Sequelize instance for use in models
module.exports = sequelize;
