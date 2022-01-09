const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'mysql',
        logging: false,
        dialectOptions: {
            multipleStatements: true
        }
    }
);

exports.testDBConnection = async () => {
    try {
        await sequelize.authenticate()
        console.log('DB Connection Established!');

        await require('./startup').syncModels();

        let [anyCCA, _] = await sequelize.query('SELECT * FROM CCA;');

        if (!anyCCA.length) {
            const defaultCCA = await require('../models/cca.model').create({
                name: "Hammad CCA",
                designation: "HOD",
                email: "22100278@lums.edu.pk",
                password: require('../services/helper-funcs').hash("Test12345"),
                active: true
            });
    
            await require('../models/ccaaccess.model').create({
                id: defaultCCA.id,
                account: true,
                approval: true,
                review: true,
                verify: true,
                cancel: true,
                log: true,
                category: true
            });
        }

    } catch(err) {
        console.log('Unable to Establish DB Connection!', '\n', err)
    }
}

exports.sequelize = sequelize;