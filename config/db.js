require("dotenv").config();
const Sequelize = require("sequelize");
const sequelize = new Sequelize(
    process.env.DATABASE_NAME,
    process.env.DATABASE_USERNAME,
    process.env.DATABASE_PASSWORD,
    {
        host: process.env.DATABASE_HOST,
        dialect: "mysql",
    }
);

sequelize.sync()
    .then(() => {
        console.log("Table created successfully!");
    })
    .catch((error) => {
        console.error("Unable to create table : ", error);
    });

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.users = require("../User/user.model")(sequelize, Sequelize);
db.tasks = require("../Task/task.model")(sequelize, Sequelize);
db.subtask = require("../SubTask/subtask.model")(sequelize, Sequelize);

db.users.hasMany(db.tasks, { onDelete: 'cascade', foreignKey: "user_id" });
db.tasks.belongsTo(db.users , { foreignKey: "user_id" });

db.tasks.hasMany(db.subtask, { onDelete: "cascade", foreignKey: "task_id" });
db.subtask.belongsTo(db.tasks , { foreignKey: "task_id" });

module.exports = db;