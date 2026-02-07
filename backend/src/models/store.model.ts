import { DataTypes } from "sequelize";
import sequelizedb from "../db/config";

const Store=sequelizedb.define("Store",{
    id:{
        type:DataTypes.UUID,
        defaultValue:DataTypes.UUIDV4,
        primaryKey:true,
    },
    url:{
        type:DataTypes.STRING,
        allowNull:true
    },
    status:{
        type:DataTypes.ENUM("PROVISIONING","READY","FAILED","DELETING"),
        allowNull:false
    },
    engine:{
        type:DataTypes.ENUM("woocommerce","medusa"),
        allowNull:false,
    },
    namespace:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true
    },
    helmRelease:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true
    },
    errorMessage:{
        type:DataTypes.TEXT,
        allowNull:true,
    }

},
{
    timestamps:true,
    tableName:"stores"
}
)
export default Store;