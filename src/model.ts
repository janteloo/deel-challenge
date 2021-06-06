import { Sequelize, DataTypes, Model } from "sequelize";

export const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database.sqlite3",
});

export class Profile extends Model {
  public id: number;

  public firstName: string;

  public lastName: string;

  public profession: string;

  public balance: number;

  public type: string;
}

export class Contract extends Model {
  public id: number;

  public terms: string;

  public status: string;

  public clientId: number;

  public contractorId: number;
}

export class Job extends Model {
  public description: string;

  public price: number;

  public paid: boolean;

  public paymentDate: Date;

  public contractId: number;
}

Profile.init(
  {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    profession: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    balance: {
      type: DataTypes.DECIMAL(12, 2),
    },
    type: {
      type: DataTypes.ENUM("client", "contractor"),
    },
  },
  {
    sequelize,
    modelName: "Profile",
  }
);

Contract.init(
  {
    terms: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("new", "in_progress", "terminated"),
    },
  },
  {
    sequelize,
    modelName: "Contract",
  }
);

Job.init(
  {
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    paid: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    paymentDate: {
      type: DataTypes.DATE,
    },
  },
  {
    sequelize,
    modelName: "Job",
  }
);

Profile.hasMany(Contract, {
  as: "Contractor",
  sourceKey: "id",
  foreignKey: "contractorId",
});
Contract.belongsTo(Profile, { as: "Contractor", foreignKey: "contractorId" });
Profile.hasMany(Contract, {
  as: "Client",
  sourceKey: "id",
  foreignKey: "clientId",
});
Contract.belongsTo(Profile, { as: "Client", foreignKey: "clientId" });
Contract.hasMany(Job);
Job.belongsTo(Contract);
