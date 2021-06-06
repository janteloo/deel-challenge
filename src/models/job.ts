import { Model } from "sequelize";

export interface IJob {
  description: string;

  price: number;

  paid: boolean;

  paymentDate: Date;

  contractId: number;
}
export class Job extends Model implements IJob {
  description: string;

  price: number;

  paid: boolean;

  paymentDate: Date;

  contractId: number;
}
