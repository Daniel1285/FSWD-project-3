import { expensesServer } from "./expensesServer.js";
import { usersServer } from "./usersServer.js";

const server = {
    expensesServer,
    usersServer,
};

export default { server };