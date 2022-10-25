const db = require("../config/db");
const subTask = db.subtask;
const createError = require('../utils/createError')
const { redisClient } = require('../config/redis')
const getToken = require('../utils/getToken')


exports.post = async (req, res, next) => {
    try {

        const token = getToken(req)

        const { name, desc, due_date, task_id } = req.body;

        if (!name || !desc || !task_id) {
            return res.sendStatus(400);
        }

        action = await subTask.create({
            name: name,
            desc: desc,
            due_date: due_date,
            task_id: task_id,
        });

        redisClient.del(`task:${token.user.name}`);

        return res.status(201).json({
            status: 201,
            success: true,
            message: "SubTask Created",
            subTask: action,
        });

    } catch (error) {
        console.log(error);
        next(error);
    }

};

exports.put = async (req, res, next) => {
    try {
        const token = getToken(req)

        const { name, desc, due_date } = req.body;

        const action = await subTask.update(
            {
                name: name,
                desc: desc,
                due_date: due_date,
            },
            {
                where: {
                    id: req.params.id
                }
            }
        );
        console.log(action[0]);

        redisClient.del(`task:${token.user.name}`);

        if (action[0] === 0) {
            throw createError(404, 'SubTask tidak ditemukan')
        }

        return res.status(200).json({
            status: 200,
            success: true,
            message: "SubTask berhasil diperbarui"
        });


    } catch (error) {
        console.log(error);
        next(error);
    }
};

exports.patch = async (req, res, next) => {
    try {
        const token = getToken(req);

        const subTasks = await subTask.findOne({
            where: {
                id: req.params.id
            }
        });

        if (!subTasks) {
            throw createError(400, "SubTask tidak ditemukan");
        }

        const action = await subTask.update(
            {
                status: !subTasks.status
            },
            {
                where: {
                    id: req.params.id
                }
            }
        );

        redisClient.del(`task:${token.user.name}`);

        if (action[0] === 0) {
            throw createError(404, 'SubTask tidak ditemukan')
        }

        return res.status(200).json({
            status: 200,
            success: true,
            message: `SubTask berhasil diubah menjadi ${!subTasks.status ? "selesai" : "belum selesai"}`
        });

    } catch (error) {
        console.log(error);
        next(error);
    }
};


exports.delete = async (req, res, next) => {
    try {
        const action = await subTask.destroy({
            where: {
                id: req.params.id,
            },
        });

        console.log(action);

        if (!action) {
            throw createError(400, "SubTask tidak ditemukan");
        }

        return res.status(200).json({
            status: 200,
            success: true,
            message: "SubTask berhasil dihapus"
        });

    } catch (error) {
        console.log(error);
        next(error);
    }
}