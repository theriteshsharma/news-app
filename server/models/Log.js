const { DataTypes } = require("sequelize");
const sq = require("../utils/db");
const User = require("./User");

const NewsViewLog = sq.define("news_viewed_log", {
  interest: {
    type: DataTypes.STRING,
  },
});

NewsViewLog.belongsToMany(User);

module.exports = { NewsViewLog };
