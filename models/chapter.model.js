module.exports = (sequelize, Sequelize) => {
  const Chapter = sequelize.define("chapters", {
    name: Sequelize.TEXT + " CHARSET utf8 COLLATE utf8_general_ci",
    linkPdf: Sequelize.STRING,
  });
  return Chapter;
};
