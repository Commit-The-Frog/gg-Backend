const swaggerUi = require("swagger-ui-express")
const swaggereJsdoc = require("swagger-jsdoc")

const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "team GG api reference",
      description:
        "This is API Reference for TEAM GG",
    },
    servers: [
      {
        url: "http://54.180.96.16:3000", // 요청 URL
      },
    ],
  },
  apis: ["./controller/*.js"], //Swagger 파일 연동
}

const specs = swaggereJsdoc(options);

module.exports = { swaggerUi, specs }