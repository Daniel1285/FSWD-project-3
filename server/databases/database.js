import { expenses } from "./expenses.js";
import { currentUser } from "./currentUser.js";
import { users } from "./users.js";

const database = {
  users,
  expenses,
  currentUser,
};

export default database;