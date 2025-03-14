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
  expense.id = getExpenses(name).at(-1) ? getExpenses(name).at(-1).id + 1 : 1;
  let expenses = getExpenses(name);
  expenses.push(expense);
  saveToLocalStorage(name, expenses);
  return true;
}

function putExpense(name, id, expense) {
  expense.id = id;

  let expenses = getExpenses(name);
  let index = expenses.findIndex((e) => e.id == id);
  if (index == -1) {
    return false;
  }
  expenses[index] = expense;
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

function init() {
  if (!localStorage.getItem(DB_NAME)) {
    localStorage.setItem(DB_NAME, "{}");
  }
}

const expenses = {
  getExpenses,
  postExpense,
  putExpense,
  deleteExpense,
  init
};

export{expenses};