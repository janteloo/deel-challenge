import { Model } from "sequelize";

export interface IContract {
  id: number;

  terms: string;

  status: string;

  clientId: number;

  contractorId: number;
}
export class Contract extends Model implements IContract {
  id: number;

  terms: string;

  status: string;

  clientId: number;

  contractorId: number;
}
