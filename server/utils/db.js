const { Sequelize } = require("sequelize");

const sq = new Sequelize(
  process.env.DATABASE_NAME,
  process.env.DATABASE_USERNAME,
  process.env.DATABASE_PASSWORD,

  {
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    dialect: process.env.DATABASE_DIALECT,
    logging: (msg) => "",
    // dialectOptions: {
    //   ssl: "Amazon RDS",
    // },
  }
);
module.exports = sq;
