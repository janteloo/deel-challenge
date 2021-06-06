import { Router, Request, Response, NextFunction } from "express";
import HttpException from "../exceptions/HttpException";
import getProfile from "../middleware/getProfile";
import JobService from "../services/jobService";
import { validateNumberParameter } from "../helpers/paramsValidator";

class ContractController {
  public path = "/jobs";

  private jobService: JobService;

  public router = Router();

  constructor() {
    this.intializeRoutes();
    this.jobService = new JobService();
  }

  private intializeRoutes = () => {
    this.router.get(`${this.path}/unpaid`, getProfile, this.getUnpaidJobs);
    this.router.post(`${this.path}/:job_id/pay`, getProfile, this.payJob);
  };

  getUnpaidJobs = async (
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<unknown> => {
    const { profile } = request;
    try {
      const jobs = await this.jobService.getUnpaidJobs(profile.id);
      return response.json(jobs);
    } catch (error) {
      next(error);
    }
    return null;
  };

  payJob = async (
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<unknown> => {
    const { profile } = request;
    try {
      const jobId = validateNumberParameter(request.params.job_id, "job_id");
      if (profile.type === "client") {
        const payJobResponse = this.jobService.payJob(jobId, profile);
        return response.json(payJobResponse);
      }
      throw new HttpException(401, "Only clients can pay jobs");
    } catch (error) {
      next(error);
    }
    return null;
  };
}

export default ContractController;
