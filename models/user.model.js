module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("users", {
    username: Sequelize.STRING,
    password: Sequelize.STRING,
    name: Sequelize.TEXT + " CHARSET utf8 COLLATE utf8_general_ci",
    email: Sequelize.STRING,
    role: Sequelize.INTEGER,
  });
  return User;
};
