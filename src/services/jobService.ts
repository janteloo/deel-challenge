import { Op, Transaction } from "sequelize";
import { Contract } from "../models/contract";
import { Job } from "../models/job";
import { Profile } from "../models/profile";
import ProfileService from "./profileService";
import TransactionManager from "../database/transactionManager";

interface JobServiceResponse {
  success: boolean;
  errorMessage?: string;
}
class JobService {
  public profileService: ProfileService;

  public transactionManager: TransactionManager;

  constructor() {
    this.profileService = new ProfileService();
    this.transactionManager = new TransactionManager();
  }

  public getUnpaidJobs = async (profileId: number): Promise<Job[]> => {
    const jobs = await Job.findAll({
      where: {
        paid: {
          [Op.or]: [false, null],
        },
      },
      include: [
        {
          model: Contract,
          where: {
            status: "in_progress",
            [Op.or]: [{ clientId: profileId }, { contractorId: profileId }],
          },
        },
      ],
    });

    return jobs;
  };

  public payJob = async (
    jobId: number,
    clientProfile: Profile
  ): Promise<JobServiceResponse> => {
    const job = await Job.findOne({
      where: {
        id: jobId,
        paid: {
          [Op.or]: [false, null],
        },
      },
    });
    if (job) {
      const { id, balance } = clientProfile;
      try {
        if (job.price <= balance) {
          this.transactionManager.executeTransaction(
            async (transaction: Transaction) => {
              await Job.update(
                { paid: true },
                { where: { id: jobId }, transaction }
              );
              const newBalance = balance - job.price;
              await this.profileService.updateBalance(
                id,
                Number(newBalance.toFixed(2)),
                transaction
              );
            }
          );
          return this.buildSuccessResponse();
        }
        return this.buildErrorResponse(
          "Job price is bigger than current balance"
        );
      } catch (error) {
        return this.buildErrorResponse(error);
      }
    }
    return this.buildErrorResponse("Job does not exists or is already paid");
  };

  private buildSuccessResponse = (): JobServiceResponse => {
    return {
      success: true,
    };
  };

  private buildErrorResponse = (errorMessage: string): JobServiceResponse => {
    return {
      success: false,
      errorMessage,
    };
  };
}

export default JobService;
