import { Router, Request, Response } from "express";
import getProfile from "../middleware/getProfile";
import ContractService from "../services/contractService";

class ContractController {
  public path = "/contracts";

  private contractService: ContractService;

  public router = Router();

  constructor() {
    this.intializeRoutes();
    this.contractService = new ContractService();
  }

  private intializeRoutes = () => {
    this.router.get(`${this.path}/:id`, getProfile, this.getContract);
  };

  getContract = async (
    request: Request,
    response: Response
  ): Promise<unknown> => {
    const { profile } = request;
    const { id } = request.params;
    const contract = await this.contractService.getContract(Number(id));
    if (!contract) {
      return response.status(404).end();
    }

    if (contract.clientId !== profile.id) {
      return response.status(401).end();
    }
    return response.json(contract);
  };
}

export default ContractController;
