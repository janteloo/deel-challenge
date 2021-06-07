import { Sequelize, DataTypes } from "sequelize";
import { Profile } from "../models/profile";
import { Contract } from "../models/contract";
import { Job } from "../models/job";

class DatasSource {
  public dataSource: Sequelize;

  constructor() {
    this.dataSource = new Sequelize({
      dialect: "sqlite",
      storage: "./database.sqlite3",
    });
  }

  initialize = (): void => {
    this.init();
  };

  private init = () => {
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
        sequelize: this.dataSource,
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
        sequelize: this.dataSource,
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
        sequelize: this.dataSource,
        modelName: "Job",
      }
    );

    Profile.hasMany(Contract, {
      as: "Contractor",
      sourceKey: "id",
      foreignKey: "contractorId",
    });
    Contract.belongsTo(Profile, {
      as: "Contractor",
      foreignKey: "contractorId",
    });
    Profile.hasMany(Contract, {
      as: "Client",
      sourceKey: "id",
      foreignKey: "clientId",
    });
    Contract.belongsTo(Profile, { as: "Client", foreignKey: "clientId" });
    Contract.hasMany(Job);
    Job.belongsTo(Contract, { foreignKey: "contractId" });
  };
}

export default DatasSource;
