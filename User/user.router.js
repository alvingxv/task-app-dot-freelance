const express = require("express");
const userRouter = express.Router();

const userController = require("./user.controller");

userRouter.post("/register", userController.register);
userRouter.post("/login", userController.login);

module.exports = { userRouter };