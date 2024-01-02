"use strict";

// Read the .env file.
import * as dotenv from "dotenv";
import main from "../index.js";
dotenv.config();

// Require the framework
import Fastify from "fastify";

// Instantiate Fastify with some config
const app = Fastify({
    logger: true,
});

// Register your application as a normal plugin.
app.register(main, { prefix: '/' });

export default async (req, res) => {
    await app.ready();
    app.server.emit('request', req, res);
}