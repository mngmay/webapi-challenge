const express = require("express");

//import routers
const projectRouter = require("./routers/projectRouter.js");
const actionRouter = require("./routers/actionRouter.js");

const server = express();

//global middleware
server.use(express.json());

//use routers
// server.use("/projects", projectRouter);
// server.use("/actions", actionRouter);

server.get("/", (req, res) => {
  res.status(200).json({ message: "API is up" });
});

//custom middleware
function logger(req, res, next) {
  console.log(`[${new Date().toISOString()}] ${req.method} to ${req.url} `);

  next();
}

module.exports = server;
