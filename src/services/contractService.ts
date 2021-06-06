import { Op } from "sequelize";
import { Contract } from "../models/contract";

class ContractService {
  public getContract = async (
    id: number,
    profileId: number
  ): Promise<Contract | null> => {
    const contract = await Contract.findOne({
      where: {
        id,
        [Op.or]: [{ clientId: profileId }, { contractorId: profileId }],
      },
    });
    return contract;
  };

  public getContracts = async (profileId: number): Promise<Contract[]> => {
    const contracts = await Contract.findAll({
      where: {
        [Op.or]: [{ clientId: profileId }, { contractorId: profileId }],
        status: {
          [Op.or]: ["new", "in_progress"],
        },
      },
    });
    return contracts;
  };
}

export default ContractService;
