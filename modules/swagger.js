const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'BG Programming API Document',
            version: '1.0.0',
        },
        host: 'localhost:3000',
        basePath: '/'
    },
    apis: [
        `${__dirname}/post/postController.js`, 
        `${__dirname}/user/userController.js`, 
        `${__dirname}/swagger_components/*`
    ]
};

const specs = swaggerJsdoc(options);

module.exports = {
    swaggerUi,
    specs
};



