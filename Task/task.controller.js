const db = require("../config/db");
const Task = db.tasks;
const subTask = db.subtask;
const createError = require('../utils/createError')
const getToken = require("../utils/getToken");
const { redisClient } = require('../config/redis');

exports.get = async (req, res, next) => {
    try {
        const token = getToken(req)

        const getCache = await redisClient.get(`task:${token.user.name}`)

        if (!getCache) {
            const data = await Task.findAll({
                where: {
                    user_id: token.user.id
                },
                include: subTask
            });

            if (!data || data.length == 0) {
                throw createError(404, 'Task tidak ditemukan')
            }

            redisClient.set(`task:${token.user.name}`, JSON.stringify(data))

            return res.status(200).json({
                status: 200,
                info: 'not from cache',
                success: true,
                message: "Task Found",
                task: data,
            });
        }

        return res.status(200).json({
            status: 200,
            info: 'from cache',
            message: "Task berhasil diambil",
            task: JSON.parse(getCache),
        });

    } catch (error) {
        console.log(error);
        next(error)
    }
}

exports.post = async (req, res, next) => {
    try {
        const token = getToken(req)

        const action = await Task.create({
            name: req.body.name,
            desc: req.body.desc,
            due_date: req.body.due_date,
            user_id: token.user.id
        });

        redisClient.del(`task:${token.user.name}`)

        return res.status(200).json({
            status: 200,
            message: "Task berhasil dibuat",
            task: action,
        });
    } catch (error) {
        next(error)
    }
}

exports.put = async (req, res, next) => {
    try {

        const token = getToken(req)
        const action = await Task.update(
            {
                name: req.body.name,
                desc: req.body.desc,
                due_date: req.body.due_date,
            },
            {
                where: {
                    id: req.params.id,
                    user_id: token.user.id
                },
            }
        );
        redisClient.del(`task:${token.user.name}`)

        if (action[0] === 0) {
            throw createError(404, 'Task tidak ditemukan')
        }

        return res.status(200).json({
            status: 200,
            message: "Task berhasil diubah",
            task: action,
        });

    } catch (error) {
        next(error)
    }
}

exports.patch = async (req, res, next) => {
    try {
        const token = getToken(req)

        const task = await Task.findOne({
            where: {
                id: req.params.id,
            },
        });

        if (!task) {
            throw createError(404, 'Task tidak ditemukan')
        }

        const action = await Task.update(
            {
                status: !task.status,
            },
            {
                where: {
                    id: req.params.id,
                    user_id: token.user.id
                },
            }
        );

        if (action.length == 0) {
            throw createError(404, 'Task tidak ditemukan')
        }

        redisClient.del(`task:${token.user.name}`)

        return res.status(200).json({
            status: 200,
            message: "Task berhasil diubah",
            task: action,
        });

    } catch (error) {
        next(error)
    }
}


exports.delete = async (req, res, next) => {
    try {
        const token = getToken(req)
        const action = await Task.destroy({
            where: {
                id: req.params.id,
                user_id: token.user.id
            },
        });

        redisClient.del(`task:${token.user.name}`)

        if (action === 0) {
            throw createError(404, 'Task tidak ditemukan')
        }

        return res.status(200).json({
            status: 200,
            message: "Task berhasil dihapus",
            task: action,
        });


    } catch (error) {
        next(error)
    }
}

exports.createTaskWithSubTask = async (req, res, next) => {
    try {

        const token = getToken(req)
        var t = await db.sequelize.transaction();

        const task = await Task.create({
            name: req.body.name,
            desc: req.body.desc,
            due_date: req.body.due_date,
            user_id: token.user.id
        }, { transaction: t });


        const subtasks = await subTask.bulkCreate(
            req.body.subtask.map((item) => {
                return {
                    name: item.name,
                    desc: item.desc,
                    due_date: item.due_date,
                    task_id: task.id,
                };
            }),
            { transaction: t }
        );

        redisClient.del(`task:${token.user.name}`)

        await t.commit();

        return res.status(200).json({
            status: 200,
            message: "Task berhasil dibuat",
            task: task,
            subtask: subtasks
        });


    } catch (error) {
        await t.rollback();
        next(error)
    }
}
