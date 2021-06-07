/* eslint-disable no-undef */
import ContractService from "../../src/services/contractService";
import { Contract, IContract } from "../../src/models/contract";

describe("Contract Service", () => {
  const service = new ContractService();

  it("returns a contract", async () => {
    const contract: IContract = {
      id: 1,
      terms: "terms",
      status: "new",
      clientId: 3,
      contractorId: 2,
    };
    const findOne = jest
      .spyOn(Contract, "findOne")
      .mockResolvedValue(contract as Contract);
    await service.getContract(1, 2);
    expect(findOne).toHaveBeenCalled();
  });

  it("returns a list of contracts", async () => {
    const contract1: IContract = {
      id: 1,
      terms: "terms",
      status: "in_progress",
      clientId: 3,
      contractorId: 2,
    };

    const contract2: IContract = {
      id: 2,
      terms: "terms2",
      status: "in_progress",
      clientId: 3,
      contractorId: 2,
    };

    const findAll = jest
      .spyOn(Contract, "findAll")
      .mockResolvedValue([contract1 as Contract, contract2 as Contract]);
    await service.getContracts(2);
    expect(findAll).toHaveBeenCalled();
  });
});
