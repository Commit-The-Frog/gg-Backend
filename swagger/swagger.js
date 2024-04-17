const swaggerUi = require("swagger-ui-express")
const swaggereJsdoc = require("swagger-jsdoc")

const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "team LV42 api reference",
      description:
        "This is API Reference for TEAM LV42",
    },
    servers: [
      {
        url: process.env.SWAGGER_HOST, // 요청 URL
      },
    ],
  },
  apis: ["./controller/*.js"], //Swagger 파일 연동
}

const specs = swaggereJsdoc(options);

module.exports = { swaggerUi, specs }