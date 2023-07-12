const { DataTypes } = require("sequelize");
const sq = require("../utils/db");

const ShortNews = sq.define("short_news", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  slug: {
    type: DataTypes.STRING,
    unique: true,
  },
  title: {
    type: DataTypes.STRING(200),
  },
  summary: {
    type: DataTypes.STRING,
  },
  category: {
    type: DataTypes.STRING,
  },
  date: {
    type: DataTypes.DATE,
  },
  link: {
    type: DataTypes.STRING,
  },
});
//ShortNews.sync({ alter: true });
module.exports = ShortNews;
