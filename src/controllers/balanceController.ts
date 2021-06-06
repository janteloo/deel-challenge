import { Router, Request, Response, NextFunction } from "express";
import HttpException from "../exceptions/HttpException";
import { validateNumberParameter } from "../helpers/paramsValidator";
import getProfile from "../middleware/getProfile";
import { Job } from "../models/job";
import JobService from "../services/jobService";
import ProfileService from "../services/profileService";

class BallanceController {
  public path = "/balances";

  public jobService: JobService;

  public profileService: ProfileService;

  public router = Router();

  constructor() {
    this.intializeRoutes();
    this.jobService = new JobService();
    this.profileService = new ProfileService();
  }

  private intializeRoutes = () => {
    this.router.post(`${this.path}/deposit/:userId`, getProfile, this.deposit);
  };

  deposit = async (
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<unknown> => {
    const { profile } = request;
    try {
      const userId = validateNumberParameter(request.params.userId, "userId");
      const amount = validateNumberParameter(request.body.amount, "amount");

      const unpaidJobs = await this.jobService.getUnpaidJobs(profile.id);
      const total = unpaidJobs
        .map((job: Job) => job.price)
        .reduce((sum: number, val: number) => sum + val, 0);

      const maximumDeposit = total > 0 ? (25 * total) / 100 : amount;

      if (amount <= maximumDeposit) {
        await this.profileService.increaseBalance(
          Number(userId),
          Number(amount)
        );
        return response.sendStatus(200);
      }
      throw new HttpException(
        422,
        "Amount is bigger than the maximum available deposit"
      );
    } catch (error) {
      next(error);
    }
    return null;
  };
}

export default BallanceController;
