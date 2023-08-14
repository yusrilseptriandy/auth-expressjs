import { Sequelize } from "sequelize";

const database = new Sequelize("auth_db", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

export default database;
