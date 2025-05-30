import swaggerJSDoc from "swagger-jsdoc";
import path from "path";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "My API",
    version: "1.0.0",
    description: "My API Description",
  },
};

const options = {
  swaggerDefinition,
  apis: [
    path.resolve(__dirname, "../Routes/*.{ts,js}"),
    // path.resolve(__dirname, "../../src/util/routes.yml"),
  ],
};
console.log();
const swaggerSpec = swaggerJSDoc(options);
export default swaggerSpec;
