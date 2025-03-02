//  simulate a database for expenses using the localStorage
const DB_NAME = "expenses";

function getExpenses(name) {
  return JSON.parse(localStorage.getItem(DB_NAME))[name] || [];
}

function saveToLocalStorage(name, data) {
  let prev = JSON.parse(localStorage.getItem(DB_NAME) || "{}");
  prev[name] = data;
  localStorage.setItem(DB_NAME, JSON.stringify(prev));
}

function postExpense(name, expense) {
  let data = {
    expense: expense,
    id: getExpenses(name).at(-1).id + 1 || 1
  };

  let expenses = getExpenses(name);
  expenses.push(data);
  saveToLocalStorage(name, expenses);
  return true;
}

function putExpense(name, id, expense) {
  let data = {
    expense: expense,
    id: id
  };

  let expenses = getExpenses(name);
  let index = expenses.findIndex((e) => e.id == id);
  if (index == -1) {
    return false;
  }
  expenses[index] = data;
  saveToLocalStorage(name, expenses);
  return true;
}

function deleteExpense(name, id) {
  let expenses = getExpenses(name);
  let index = expenses.findIndex((e) => e.id === id);
  if (index == -1) {
    return false;
  }
  expenses.splice(index, 1);
  saveToLocalStorage(name, expenses);
  return true;
}

const expenses = {
  getExpenses,
  postExpense,
  putExpense,
  deleteExpense,
};

export { expenses };
