import request from "supertest";
import App from "../../src/app";
import ContractController from "../../src/controllers/contractController";
import { Contract, IContract } from "../../src/models/contract";
import { IProfile, Profile } from "../../src/models/profile";

let app;

const contract: IContract = {
  id: 1,
  terms: "terms",
  status: "in_progress",
  clientId: 3,
  contractorId: 2,
};

jest.mock("../../src/services/contractService", () => {
  // eslint-disable-next-line func-names
  return function () {
    return { getContract: () => contract as Contract };
  };
});

beforeAll(() => {
  const controllers = [new ContractController()];
  app = new App(controllers, 3001).listen();
});

describe("Contract Controller", () => {
  it("should retrieve a contract", async () => {
    const profile: IProfile = {
      id: 1,
      firstName: "Juan",
      lastName: "Antelo",
      profession: "SW Dev",
      balance: 120,
      type: "Contractor",
    };

    const findOneProfile = jest
      .spyOn(Profile, "findOne")
      .mockResolvedValue(profile as Profile);

    const res = await request(app).get("/contracts/1").set({ profile_id: 1 });

    expect(findOneProfile).toHaveBeenCalled();
    expect(res.statusCode).toEqual(200);
    const { body } = res;
    expect(body.id).toEqual(contract.id);
    expect(body.status).toEqual(contract.status);
  });

  it("should not retrieve a contract if the user is not logged in", async () => {
    const findOneProfile = jest
      .spyOn(Profile, "findOne")
      .mockResolvedValue(null);

    const res = await request(app).get("/contracts/1").set({ profile_id: 1 });

    expect(findOneProfile).toHaveBeenCalled();
    expect(res.statusCode).toEqual(401);
  });

  it("should retrieve a contract if the user is not logged in", async () => {
    const findOneProfile = jest
      .spyOn(Profile, "findOne")
      .mockResolvedValue(null);

    const res = await request(app).get("/contracts/1").set({ profile_id: 1 });

    expect(findOneProfile).toHaveBeenCalled();
    expect(res.statusCode).toEqual(401);
  });
});
