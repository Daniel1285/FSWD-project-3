import database from "./databases/database.js";

class UsersServer {
    constructor() {
        this.database = database;
    }

    createUser(user) {
        if (this.database.users.getUser(user.name)) {
            return false;
        }
        return this.database.users.postUser(user);
    }

    connectUser(name, password) {
        let user = this.database.users.getUser(name);
        if (!user) {
            return false;
        }
        if (user.password !== password) {
            return false;
        }
        this.database.currentUser.postCurrentUser(user);
        return true;
    }

    disconnectUser() {
        this.database.currentUser.logoutUser();
    }

    changePassword(name, password) {
        let user = this.database.users.getUser(name);
        if (!user) {
            return false;
        }
        user.password = password;
        return this.database.users.putUser(user, name);
    }

    deleteUser(name) {
        return this.database.users.deleteUser(name);
    }

    request(request, callback) {
        let response = { success: true, body: "" };

        switch (request.method) {
            case "POST":
                if (request.url.endsWith("/create")) {
                    let user = JSON.parse(request.data);
                    response.body = this.createUser(user);
                } else if (request.url.endsWith("/connect")) {
                    console.log(request.data);
                    let { name, password } = JSON.parse(request.data);
                    if(this.connectUser(name, password)){
                        response.body = true;
                    }
                    else{
                        response.success = false;
                        response.body = 'Invalid username or password';
                    }
                } else if (request.url.endsWith("/disconnect")) {
                    this.disconnectUser();
                    response.body = true;
                }else {
                    response.success = false;
                    response.body = "Invalid request method";
                }
                break;
            case "GET":
                if (request.url.endsWith("/currentUser")) {
                    if (!this.database.currentUser.getCurrentUser()) {
                        response.success = false;
                        response.body = "No user connected";
                    } else {
                        response.body = this.database.currentUser.getCurrentUser();
                    }
                }
                break;
            case "PUT":
                if (request.url.endsWith("/changePassword")) {
                    let { name, password } = JSON.parse(request.data);
                    response.body = this.changePassword(name, password);
                }
                break;
            case "DELETE":
                if (request.url.endsWith("/delete")) {
                    let { name } = JSON.parse(request.data);
                    response.body = this.deleteUser(name);
                }
                break;
            default:
                console.log(request.url);
                response.success = false;
                response.body = "Invalid request method";
        }
        console.log(response);
        request.responseText = JSON.stringify(response);
        callback();
    }
}


export { UsersServer };