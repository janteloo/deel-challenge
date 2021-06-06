import express, { Application } from "express";
import bodyParser from "body-parser";
import Profile from "./models/profile";
import Database from "./database";

declare global {
  namespace Express {
    interface Request {
      profile: Profile;
    }
  }
}

class App {
  public app: Application;

  public port: number;

  constructor(controllers, port) {
    this.app = express();
    this.port = port;
    this.initialize();
    this.initializeControllers(controllers);
  }

  initialize = () => {
    this.app.use(bodyParser.json());
    const sequelize = new Database();
    sequelize.initialize();
    const { database } = sequelize;
    this.app.set("sequelize", database);
    this.app.set("models", database.models);
  };

  private initializeControllers(controllers) {
    controllers.forEach((controller) => {
      this.app.use("/", controller.router);
    });
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`App listening on the port ${this.port}`);
    });
  }
}

export default App;
