import { Model } from "sequelize";

class Profile extends Model {
  id: number;

  firstName: string;

  lastName: string;

  profession: string;

  balance: number;

  type: string;
}

export default Profile;
