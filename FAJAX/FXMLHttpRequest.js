import network from "../network/network.js";

class FXMLHttpRequest {
    constructor() {
        console.log("FXMLHttpRequest constructor");
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
        network.request(this, callback);
    }
}

export {FXMLHttpRequest};