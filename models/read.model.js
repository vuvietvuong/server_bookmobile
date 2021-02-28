module.exports = (sequelize, Sequelize) => {
  const Read = sequelize.define("reads", {
    lastReading: Sequelize.DATE,
  });
  return Read;
};
