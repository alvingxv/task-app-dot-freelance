const express = require("express");
const taskRouter = express.Router();

const taskController = require("./task.controller");

taskRouter.get("/", taskController.get);
taskRouter.post("/", taskController.post);
taskRouter.put("/:id", taskController.put);
taskRouter.patch("/:id", taskController.patch);
taskRouter.delete("/:id", taskController.delete);
taskRouter.post("/subtask", taskController.createTaskWithSubTask);

module.exports = { taskRouter };
