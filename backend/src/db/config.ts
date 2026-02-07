import {Sequelize} from "sequelize";
import dotenv from "dotenv";

dotenv.config()

const dburi=process.env.DB_URI;

if (!dburi) {
    throw new Error("DB uri is not defined in .env")
}

const sequelizedb=new Sequelize(dburi,{
    dialect: "postgres",
    protocol:"postgres",
    //logging:"false",
})
export default sequelizedb