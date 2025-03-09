import { Network } from "../network/network.js";

class FXMLHttpRequest {
    constructor() {
        this.responseText = "";
    }

    open(method, url, async=true, username="", password = "") {
        this.method = method;
        this.url = url;
        this.async = async;
        this.username = username;
        this.password = password;
    }

    send(data = null, callback = () => {}) {
        this.data = data;
        var net = new Network();
        net.request(this, callback);
    }
}

export {FXMLHttpRequest};