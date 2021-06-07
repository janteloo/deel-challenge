import { Router, Request, Response, NextFunction } from "express";
import {
  validateDateParameter,
  validateNumberParameter,
} from "../helpers/paramsValidator";
import getProfile from "../middleware/getProfile";
import AdminService from "../services/adminService";

class BallanceController {
  public path = "/admin";

  public adminService: AdminService;

  public router = Router();

  constructor() {
    this.intializeRoutes();
    this.adminService = new AdminService();
  }

  private intializeRoutes = () => {
    this.router.get(
      `${this.path}/best-profession`,
      getProfile,
      this.getBestContract
    );
    this.router.get(
      `${this.path}/best-clients`,
      getProfile,
      this.getBestClients
    );
  };

  getBestContract = async (
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<unknown> => {
    const { start, end } = request.query;
    try {
      const startDate = validateDateParameter(start as string, "start");
      const endDate = validateDateParameter(end as string, "end");
      const contract = await this.adminService.getBestProfession(
        startDate,
        endDate
      );
      return response.json(contract);
    } catch (error) {
      next(error);
    }
    return null;
  };

  getBestClients = async (
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<unknown | null> => {
    const { start, end, limit } = request.query;
    try {
      const startDate = validateDateParameter(start as string, "start");
      const endDate = validateDateParameter(end as string, "end");
      const clients = await this.adminService.getBestClients(
        startDate,
        endDate,
        limit ? validateNumberParameter(limit as string, "limit") : undefined
      );
      return response.json(clients);
    } catch (error) {
      next(error);
    }
    return null;
  };
}

export default BallanceController;
