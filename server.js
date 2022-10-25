const express = require("express");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT;
const { taskRouter } = require("./Task/task.router");
const { subTaskRouter } = require("./SubTask/subtask.router");
const { userRouter } = require("./User/user.router");
const { verifyToken } = require("./middlewares/auth");
const cors = require('cors')
const handleErrors = require("./middlewares/errorHandler");

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/user", userRouter);
app.use("/task", verifyToken, taskRouter);
app.use("/subtask", verifyToken, subTaskRouter);

app.use("/", (req, res, next) => {
    res.status(200).json({
        status: 200,
        message: "Welcome to dot-test-todo",
    });
});

app.use(handleErrors);

app.listen(PORT, () => {
    console.log(`Server berjalan di port ${PORT}`);
    console.log(`http://localhost:${PORT}`);
});