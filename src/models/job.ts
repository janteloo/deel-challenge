import { Model } from "sequelize";

class Job extends Model {
  description: string;

  price: number;

  paid: boolean;

  paymentDate: Date;

  contractId: number;
}

export default Job;
