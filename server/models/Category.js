const { DataTypes } = require("sequelize");
const sq = require("../utils/db");
const User = require("./User");

const Category = sq.define("category", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
});

Category.hasOne(Category, {
  as: "parent",
  foreignKey: "parent_id",
  allowNull: true,
});

const FollowedCategory = sq.define("followed_category", {});
const BlockedCategory = sq.define("blocked_category", {});

User.belongsToMany(Category, {
  through: FollowedCategory,
  as: "followed",
  timestamps: false,
});
Category.belongsToMany(User, { through: FollowedCategory, as: "followed" });
User.belongsToMany(Category, { through: BlockedCategory, as: "blocked" });
Category.belongsToMany(User, { through: BlockedCategory, as: "blocked" });

// Category.sync();
// User.sync({ alter: true });
// Category.sync({ alter: true });

// FollowedCategory.sync();
// BlockedCategory.sync();
module.exports = { Category, FollowedCategory, BlockedCategory };
