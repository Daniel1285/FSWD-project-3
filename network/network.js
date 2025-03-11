import { UsersServer } from "../server/usersServer.js";
import { ExpensesServer } from "../server/expensesServer.js";

class Network {
    constructor() {
        this.userServer = new UsersServer();
        this.expensesServer = new ExpensesServer();
        this.dropRate = 0.1;
        this.minDelay = 1000;
        this.maxDelay = 3000;
    }

    async request(request, callback) {
        await this.sleep(); // delay before request
        console.log("Network request after sleep");
        if (Math.random() < this.dropRate) {
            request.responseText = JSON.stringify({ "success": false, body: "Network error" });
            callback();
            return;
        }

        const serverType = request.url.startsWith("/users") ? this.userServer :
                          request.url.startsWith("/expenses") ? this.expensesServer : null;
        console.log("Network request serverType: ", serverType);
        if (serverType) {
            serverType.request(request, async () => {
                await this.sleep(); // delay after request processing
                if (Math.random() < this.dropRate) {
                    request.responseText = JSON.stringify({ "success": false, body: "Network error" });
                }
                callback();
            });
        }
    }

    sleep() {
        return new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * (this.maxDelay - this.minDelay)) + this.minDelay));
    }
}

export { Network };
