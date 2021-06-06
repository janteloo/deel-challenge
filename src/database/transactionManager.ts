import { Sequelize, Transaction } from "sequelize";
import DataSource from "./dataSource";

class TransactionManager {
  public dataSource: Sequelize;

  constructor() {
    this.dataSource = new DataSource().dataSource;
  }

  executeTransaction = (
    callBack: (t: Transaction) => Promise<unknown>
  ): Promise<unknown> => {
    return this.dataSource.transaction(
      {
        isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
      },
      (t: Transaction) => callBack(t)
    );
  };
}

export default TransactionManager;
