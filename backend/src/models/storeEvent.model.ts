import { DataType, DataTypes } from "sequelize";
import sequelizedb from "../db/config";

const StoreEvent= sequelizedb.define(
    "StoreEvent",
    {
        id:{
            type:DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
    },
    storeId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    tableName: "store_events",
  }
);

export default StoreEvent;