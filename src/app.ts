import "reflect-metadata";
import express from "express";
import bodyParser from "body-parser";
import { InversifyExpressServer } from "inversify-express-utils";
import { myContainer } from "./inversify.config";

// Import controllers for side effects

// Authentication
import "./controllers/AuthController";
import "./controllers/ProfileController";
import "./controllers/PropertyController";
import "./controllers/PaymentController";

const server = new InversifyExpressServer(myContainer);

server.setConfig((app) => {
  app.use(bodyParser.json());
});

server.setErrorConfig((app) => {
  // 404 handler middleware
  app.use((req, res, next) => {
    res.status(404).send({
      success: false,
      statusCode: 404,
      message: `Endpoint ${req.originalUrl} Not Found`,
      data: {},
    });
  });

  // Error handling middleware
  app.use(
    (
      error: any,
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      console.error(error.stack);
      return res.status(500).json({
        success: false,
        statusCode: 500,
        message: "Internal Server Error",
        data: {},
      });
    }
  );
});
const app = server.build();
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

export default app;
