import App from "./app";
import ContractController from "./controllers/contractController";

const app = new App([new ContractController()], 3001);

app.listen();
