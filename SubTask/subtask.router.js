const express = require("express");
const subTaskRouter = express.Router();

const subTaskController = require("./subtask.controller");

subTaskRouter.post("/", subTaskController.post);
subTaskRouter.put("/:id", subTaskController.put);
subTaskRouter.delete("/:id", subTaskController.delete);
subTaskRouter.patch("/:id", subTaskController.patch);

module.exports = { subTaskRouter };
