const sequelize = require('./index');

sequelize.authenticate()
  .then(() => console.log('Connection to MySQL successful!'))
  .catch((err) => console.error('Unable to connect to the database:', err));
