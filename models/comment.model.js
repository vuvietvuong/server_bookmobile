module.exports = (sequelize, Sequelize) => {
  const Comment = sequelize.define("comments", {
    comment: Sequelize.TEXT + " CHARSET utf8 COLLATE utf8_general_ci",
  });
  return Comment;
};
