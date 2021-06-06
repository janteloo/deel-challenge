import App from "./app";
import BallanceController from "./controllers/balanceController";
import ContractController from "./controllers/contractController";
import JobController from "./controllers/jobController";
import AdminController from "./controllers/adminController";

const app = new App(
  [
    new ContractController(),
    new JobController(),
    new BallanceController(),
    new AdminController(),
  ],
  3001
);

app.listen();
