import { Network } from "../network/network.js";

class FXMLHttpRequest {
    constructor() {
        this.responseText = "";
    }

    open(method, url) {
        this.method = method;
        this.url = url;
    }

    send(data = null, callback = () => {}) {
        this.data = data;
        var net = new Network();
        net.request(this, callback);
    }
}

export {FXMLHttpRequest};