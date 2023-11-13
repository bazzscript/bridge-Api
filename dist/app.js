"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const body_parser_1 = __importDefault(require("body-parser"));
const inversify_express_utils_1 = require("inversify-express-utils");
const inversify_config_1 = require("./inversify.config");
// Import controllers for side effects
// Authentication
require("./controllers/AuthController");
require("./controllers/ProfileController");
require("./controllers/PropertyController");
require("./controllers/PaymentController");
const server = new inversify_express_utils_1.InversifyExpressServer(inversify_config_1.myContainer);
server.setConfig((app) => {
    app.use(body_parser_1.default.json());
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
    app.use((error, req, res, next) => {
        console.error(error.stack);
        return res.status(500).json({
            success: false,
            statusCode: 500,
            message: "Internal Server Error",
            data: {},
        });
    });
});
const app = server.build();
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
exports.default = app;
