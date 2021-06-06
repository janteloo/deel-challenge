import express from "express";
import bodyParser from "body-parser";
import { Profile, sequelize } from "./model";
import getProfile from "./middleware/getProfile";

declare global {
  namespace Express {
    interface Request {
      profile: Profile;
    }
  }
}

const app = express();
app.use(bodyParser.json());
app.set("sequelize", sequelize);
app.set("models", sequelize.models);

/**
 * FIX ME!
 * @returns contract by id
 */
app.get("/contracts/:id", getProfile, async (req, res) => {
  const { Contract } = req.app.get("models");
  const { id } = req.params;
  const contract = await Contract.findOne({ where: { id } });
  if (!contract) {
    return res.status(404).end();
  }
  return res.json(contract);
});

export default app;
