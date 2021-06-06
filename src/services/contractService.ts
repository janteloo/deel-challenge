import Contract from "../models/contract";

class ContractService {
  public getContract = async (id: number): Promise<Contract | null> => {
    const contract = await Contract.findOne({ where: { id } });
    return contract;
  };
}

export default ContractService;
