//  simulate a database for expenses using the localStorage
const DB_NAME = "expenses";

function getExpenses() {
  return JSON.parse(localStorage.getItem(DB_NAME)) || [];
}

function postExpense(expense) {
  let data = {
    expense: expense,
    id: getExpenses().length + 1
  };

  let expenses = getExpenses();
  expenses.push(data);
  localStorage.setItem(DB_NAME, JSON.stringify(expenses));
  return true;
}

function putExpense(id, expense) {
  let data = {
    expense: expense,
    id: id
  };

  let expenses = getExpenses();
  let index = expenses.findIndex((e) => e.id == id);
  if (index == -1) {
    return false;
  }
  expenses[index] = data;
  localStorage.setItem(DB_NAME, JSON.stringify(expenses));

  return true;
}

function deleteExpense(id) {
  let expenses = getExpenses();
  let index = expenses.findIndex((e) => e.id === id);
  if (index == -1) {
    return false;
  }
  expenses.splice(index, 1);
  localStorage.setItem(DB_NAME, JSON.stringify(expenses));

  return true;
}

const expenses = {
  getExpenses,
  postExpense,
  putExpense,
  deleteExpense,
};

export { expenses };
