module.exports = (sequelize, Sequelize) => {
  const Book = sequelize.define("books", {
    name: Sequelize.TEXT + " CHARSET utf8 COLLATE utf8_general_ci",
    description: Sequelize.TEXT + " CHARSET utf8 COLLATE utf8_general_ci",
    author: Sequelize.TEXT + " CHARSET utf8 COLLATE utf8_general_ci",
    imageUrl: Sequelize.STRING,
  });
  return Book;
};
