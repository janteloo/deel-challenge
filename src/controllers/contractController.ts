import { Router, Request, Response, NextFunction } from "express";
import HttpException from "../exceptions/HttpException";
import getProfile from "../middleware/getProfile";
import ContractService from "../services/contractService";
import { validateNumberParameter } from "../helpers/paramsValidator";

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
    this.router.get(this.path, getProfile, this.getContracts);
  };

  getContract = async (
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<unknown> => {
    const { profile } = request;
    const { id } = request.params;
    let contract = null;
    try {
      const contractId = validateNumberParameter(id, "id");
      contract = await this.contractService.getContract(contractId, profile.id);
      if (!contract) {
        throw new HttpException(404, "Contract could not be found");
      }
      return response.json(contract);
    } catch (error) {
      next(error);
    }
    return null;
  };

  getContracts = async (
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<unknown> => {
    const { profile } = request;
    try {
      const contracts = await this.contractService.getContracts(profile.id);
      return response.json(contracts);
    } catch (error) {
      next(error);
    }
    return null;
  };
}

export default ContractController;
