import { Transaction, UpdateOptions } from "sequelize";
import { Profile } from "../models/profile";

class ProfileService {
  public increaseBalance = async (
    profileId: number,
    balance: number
  ): Promise<void> => {
    await Profile.increment("balance", {
      by: balance,
      where: { id: profileId },
    });
  };

  public updateBalance = async (
    profileId: number,
    balance: number,
    transaction?: Transaction
  ): Promise<void> => {
    const whereQuery: UpdateOptions<unknown> = {
      where: { id: profileId },
    };
    if (transaction) {
      whereQuery.transaction = transaction;
    }
    await Profile.update({ balance }, { ...whereQuery });
  };
}

export default ProfileService;
