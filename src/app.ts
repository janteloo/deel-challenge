import express, { Application } from "express";
import bodyParser from "body-parser";
import { Profile } from "./models/profile";
import DataSource from "./database/dataSource";
import errorMiddleware from "./middleware/errorMiddleware";

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
    this.initializeErrorHandler();
  }

  initialize = () => {
    this.app.use(bodyParser.json());
    const sequelize = new DataSource();
    sequelize.initialize();
    const { dataSource } = sequelize;
    this.app.set("sequelize", dataSource);
    this.app.set("models", dataSource.models);
  };

  private initializeControllers = (controllers) => {
    controllers.forEach((controller) => {
      this.app.use("/", controller.router);
    });
  };

  private initializeErrorHandler = () => {
    this.app.use(errorMiddleware);
  };

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`App listening on the port ${this.port}`);
    });
  }
}

export default App;
