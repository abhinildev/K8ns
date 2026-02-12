import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../db/config";

export interface StoreAttributes {
  id: string;
  url?: string | null;
  status: "PROVISIONING" | "READY" | "FAILED" | "DELETING";
  engine: "woocommerce" | "medusa";
  namespace: string;
  helmRelease: string;
  errorMessage?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

type StoreCreationAttributes = Optional<
  StoreAttributes,
  "id" | "url" | "errorMessage" | "createdAt" | "updatedAt"
>;

class Store
  extends Model<StoreAttributes, StoreCreationAttributes>
  implements StoreAttributes
{
  public id!: string;
  public url!: string | null;
  public status!: "PROVISIONING" | "READY" | "FAILED" | "DELETING";
  public engine!: "woocommerce" | "medusa";
  public namespace!: string;
  public helmRelease!: string;
  public errorMessage!: string | null;
}

Store.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("PROVISIONING", "READY", "FAILED", "DELETING"),
      allowNull: false,
      defaultValue: "PROVISIONING",
    },
    engine: {
      type: DataTypes.ENUM("woocommerce", "medusa"),
      allowNull: false,
    },
    namespace: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    helmRelease: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    errorMessage: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "stores",
    timestamps: true,
  }
);

export default Store;
