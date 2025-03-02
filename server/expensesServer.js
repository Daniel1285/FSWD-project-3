import database from "./databases/database.js";

function getUserExpenses() {
    return database.expenses.getExpenses(database.currentUser.getCurrentUser().name);
}

function getExpense(id) {
    return getUserExpenses().find((e) => e.id === id);
}

function postExpense(expense) {
    return database.expenses.postExpense(database.currentUser.getCurrentUser().name, expense);
}

function putExpense(id, expense) {
    return database.expenses.putExpense(database.currentUser.getCurrentUser().name, id, expense);
}

function deleteExpense(id) {
    return database.expenses.deleteExpense(database.currentUser.getCurrentUser().name, id);
}

