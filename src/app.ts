import express, { Application } from "express";
import bodyParser from "body-parser";
import swaggerUi from "swagger-ui-express";
import { Profile } from "./models/profile";
import DataSource from "./database/dataSource";
import errorMiddleware from "./middleware/errorMiddleware";
import swaggerDocument from "../swagger.json";

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
    this.app.use(
      "/api-docs",
      swaggerUi.serve,
      swaggerUi.setup(swaggerDocument)
    );
    this.initialize();
    this.initializeControllers(controllers);
    this.initializeErrorHandler();
  }

  private initialize = () => {
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
    return this.app.listen(this.port, () => {
      console.log(`App listening on the port ${this.port}`);
    });
  }
}

export default App;
