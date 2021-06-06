import { Model } from "sequelize";

export interface IProfile {
  id: number;

  firstName: string;

  lastName: string;

  profession: string;

  balance: number;

  type: string;
}
export class Profile extends Model implements IProfile {
  id: number;

  firstName: string;

  lastName: string;

  profession: string;

  balance: number;

  type: string;
}
