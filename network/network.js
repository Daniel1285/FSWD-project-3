import server from "../server/server";

class Network {
    constructor() {
        this.userServer = server.usersServer;
        this.expensesServer = server.expensesServer;
        this.dropRate = 0.1;
        this.minDelay = 1000;
        this.maxDelay = 3000;
    }

    request(request, callback) {
        sleep();
        if (Math.random() < this.dropRate) {
            request.responseText = JSON.stringify({"success":false, body: ""});
            callback();
            return;
        } else{
            if (request.url.startsWith("/users")) {
                this.userServer.request(request, () => {
                    sleep();
                    if (Math.random() < this.dropRate) {
                        request.responseText = JSON.stringify({"success":false, body: ""});
                    }
                    callback();
                });
                return;
            } else if (request.url.startsWith("/expenses")) {
                this.expensesServer.request(request, () => {
                    sleep();
                    if (Math.random() < this.dropRate) {
                        request.responseText = JSON.stringify({"success":false, body: ""});
                    }
                    callback();
                });
                return;
            }
        }
    }
    sleep() {
        setTimeout(() => {}, Math.floor(Math.random() * (this.maxDelay - this.minDelay)) + this.minDelay);
    }
}