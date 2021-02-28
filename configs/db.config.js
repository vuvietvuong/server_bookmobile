const dotenv = require("dotenv");
dotenv.config();
const Sequelize = require("sequelize");// hỗ trợ truy cập đến MySQL,SQLite, MariaDB

const env = process.env.NODE_ENV || "development";
const config = require("./config.json")[env];

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

const db = {};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.user = require("../models/user.model")(sequelize, Sequelize);
db.book = require("../models/book.model")(sequelize, Sequelize);
db.chapter = require("../models/chapter.model")(sequelize, Sequelize);
db.comment = require("../models/comment.model")(sequelize, Sequelize);
db.vote = require("../models/vote.model")(sequelize, Sequelize);
db.read = require("../models/read.model")(sequelize, Sequelize);

db.user.hasMany(db.vote);
db.vote.belongsTo(db.user);

db.user.hasMany(db.comment);
db.comment.belongsTo(db.user);

db.book.hasMany(db.vote);
db.vote.belongsTo(db.book);

db.book.hasMany(db.comment);
db.comment.belongsTo(db.book);

db.book.hasMany(db.chapter);
db.chapter.belongsTo(db.book);

db.user.hasMany(db.read);
db.read.belongsTo(db.user);

db.chapter.hasMany(db.read);
db.read.belongsTo(db.chapter);

db.book.hasMany(db.read);
db.read.belongsTo(db.book);

module.exports = db;
