import database from "./databases/database.js";

function createUser(user) {
    if (database.users.getUser(user.name)) {
        return false;
    }
    return database.users.postUser(user);
}

function connectUser(name, password) {
    let user = database.users.getUser(name);
    if (!user) {
        return false;
    }
    if (user.password !== password) {
        return false;
    }
    database.currentUser.postCurrentUser(וser);
}

function disconnectUser() {
    database.currentUser.logoutUser();
}

function changePassword(name, password) {
    let user = database.users.getUser(name);
    if (!user) {
        return false;
    }
    user.password = password;
    return database.users.putUser(user, name);
}