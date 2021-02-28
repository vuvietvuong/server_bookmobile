module.exports = (sequelize, Sequelize) => {
  const Vote = sequelize.define("votes", {
    vote: Sequelize.INTEGER,
  });
  return Vote;
};
