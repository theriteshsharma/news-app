const { DataTypes } = require("sequelize");
const sq = require("../utils/db");
const { Category } = require("./Category");

const News = sq.define("news", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  slug: {
    type: DataTypes.STRING,
    allowNUll: false,
    unique: true,
  },
  title: {
    type: DataTypes.STRING,
  },
  desc: {
    type: DataTypes.TEXT,
  },
  content: {
    type: DataTypes.TEXT,
  },
  image_url: {
    type: DataTypes.STRING,
  },
  video_url: {
    type: DataTypes.STRING,
  },
  link: {
    type: DataTypes.STRING,
  },
  pub_date: {
    type: DataTypes.DATE,
  },
  country: {
    type: DataTypes.STRING,
  },
  language: {
    type: DataTypes.STRING,
  },
  keywords_str: {
    type: DataTypes.STRING,
  },
  location: {
    type: DataTypes.STRING,
  },
  isAdmin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

News.belongsTo(Category, { allowNUll: true });

//News.sync({ alter: true });

module.exports = News;
