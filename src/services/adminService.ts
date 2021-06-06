/* eslint-disable @typescript-eslint/no-explicit-any */
import { Op, Sequelize } from "sequelize";

import { Contract, IContract } from "../models/contract";
import { Job } from "../models/job";
import { Profile } from "../models/profile";

interface ContractExtraInfo extends IContract {
  totalPaid: number;
}

interface ProfilePaidInfo {
  id: number;
  fullName: string;
  paid: number;
}

class AdminService {
  public getBestContract = async (
    startDate: Date,
    endDate: Date
  ): Promise<ContractExtraInfo> => {
    const job = await Job.findOne({
      where: { createdAt: { [Op.between]: [startDate, endDate] }, paid: true },
      include: [
        {
          model: Contract,
        },
      ],
      attributes: [[Sequelize.fn("sum", Sequelize.col("price")), "totalPaid"]],
      raw: true,
      order: Sequelize.literal("totalPaid DESC"),
      group: ["Contract.id"],
    });

    const contract = { ...job } as any;
    const contractExtraInfo: ContractExtraInfo = {
      id: contract["Contract.id"],
      terms: contract["Contract.terms"],
      status: contract["Contract.status"],
      contractorId: contract["Contract.contractorId"],
      clientId: contract["Contract.clientId"],
      totalPaid: contract.totalPaid,
    };
    return contractExtraInfo;
  };

  public getBestClients = async (
    startDate: Date,
    endDate: Date,
    limit = 2
  ): Promise<ProfilePaidInfo[]> => {
    const clients = await Job.findAll({
      where: { createdAt: { [Op.between]: [startDate, endDate] }, paid: true },
      include: [
        {
          model: Contract,
          include: [
            {
              model: Profile,
              attributes: ["id", "firstName", "lastName"],
              as: "Client",
            },
          ],
        },
      ],
      attributes: [[Sequelize.fn("sum", Sequelize.col("price")), "paid"]],
      raw: true,
      order: Sequelize.literal("paid DESC"),
      group: ["Contract.clientId"],
      limit,
    });

    const clientsInfo = clients as any[];
    const profiles: ProfilePaidInfo[] = clientsInfo.map((client: any) => {
      const fullName = `${client["Contract.Client.firstName"]} ${client["Contract.Client.lastName"]}`;
      return {
        id: client["Contract.clientId"],
        fullName,
        paid: client.paid,
      };
    });

    return profiles;
  };
}

export default AdminService;
