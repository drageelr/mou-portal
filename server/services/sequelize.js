const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'mysql'
    }
);

exports.testDBConnection = () => {
    sequelize.authenticate()
    .then(() => console.log('DB Connection Established!'))
    .catch((err) => console.log('Unable to Establish DB Connection!', '\n', err));
}

exports.sequelize = sequelize;