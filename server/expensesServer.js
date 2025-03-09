import database from "./databases/database.js";
class ExpensesServer {
    constructor() {
        this.database = database;
    }

    getUserExpenses() {
        return this.database.expenses.getExpenses(this.database.currentUser.getCurrentUser().name);
    }

    getExpense(id) {
        return this.getUserExpenses().find((e) => e.id === id);
    }

    postExpense(expense) {
        return this.database.expenses.postExpense(this.database.currentUser.getCurrentUser().name, expense);
    }

    putExpense(id, expense) {
        return this.database.expenses.putExpense(this.database.currentUser.getCurrentUser().name, id, expense);
    }

    deleteExpense(id) {
        return this.database.expenses.deleteExpense(this.database.currentUser.getCurrentUser().name, id);
    }

    request(request, callback) {
        let response = { success: true, body: "" };

        switch (request.method) {
            case "GET":
                if (request.url.endsWith("/expenses")) {
                    response.body = this.getUserExpenses();
                } else if (request.url.match(/\/expenses\/\d+$/)) {
                    let id = parseInt(request.url.split("/").pop());
                    response.body = this.getExpense(id);
                }
                break;
            case "POST":
                if (request.url.endsWith("/expenses")) {
                    let expense = JSON.parse(request.data);
                    response.body = this.postExpense(expense);
                }
                break;
            case "PUT":
                if (request.url.match(/\/expenses\/\d+$/)) {
                    let id = parseInt(request.url.split("/").pop());
                    let expense = JSON.parse(request.data);
                    response.body = this.putExpense(id, expense);
                }
                break;
            case "DELETE":
                if (request.url.match(/\/expenses\/\d+$/)) {
                    let id = parseInt(request.url.split("/").pop());
                    response.body = this.deleteExpense(id);
                }
                break;
            default:
                response.success = false;
                response.body = "Invalid request method";
        }

        request.responseText = JSON.stringify(response);
        callback();
    }
}

const expensesServer = new ExpensesServer(database);

export { expensesServer };
