const { DataTypes } = require("sequelize");
const sq = require("../utils/db");
const News = require("./News");

const Keyword = sq.define("keyword", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
  },
});

Keyword.belongsTo(News);
News.hasMany(Keyword);

//Keyword.sync();

module.exports = Keyword;
