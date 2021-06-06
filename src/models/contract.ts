import { Model } from "sequelize";

class Contract extends Model {
  id: number;

  terms: string;

  status: string;

  clientId: number;

  contractorId: number;
}

export default Contract;
