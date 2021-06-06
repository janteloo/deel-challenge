import { Op, Transaction } from "sequelize";
import { Contract } from "../models/contract";
import { Job } from "../models/job";
import { Profile } from "../models/profile";
import ProfileService from "./profileService";
import TransactionManager from "../database/transactionManager";

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
  ): Promise<boolean> => {
    const job = await Job.findOne({
      where: {
        id: jobId,
        paid: {
          [Op.or]: [false, null],
        },
      },
    });
    console.log(`This is the balance ${clientProfile.balance}`);
    if (job) {
      console.log("There is a job");
      const { id, balance } = clientProfile;
      if (job.price <= balance) {
        try {
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
          return true;
        } catch (error) {
          console.log(error);
          return false;
        }
      }
      // TODO error when no balance
    }

    // TODO error when job does not exists
    return false;
  };
}

export default JobService;
