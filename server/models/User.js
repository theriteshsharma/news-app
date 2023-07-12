const { DataTypes } = require("sequelize");
const sq = require("../utils/db");
const { hash, hashSync } = require("bcrypt");

const User = sq.define("user", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
    validate: {
      len: {
        args: [5, 20],
        msg: "Username should me between 5 to 20 Characters",
      },
    },
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: {
        args: true,
        msg: "Please Provide a valid Email",
      },
    },
  },
  password: {
    type: DataTypes.STRING(100),
    async set(value) {
      let pass_hash = hashSync(value, 10);
      console.log(pass_hash);
      this.setDataValue("password", pass_hash);
    },
  },
  location: {
    type: DataTypes.STRING,
  },
  isAdmin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});
//User.sync({ alter: true });

module.exports = User;
