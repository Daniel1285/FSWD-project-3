class FXMLHttpRequest {
    constructor() {
        this.readyState = 0;
        this.status = 0;
        this.responseText = "";
        this.onreadystatechange = null;
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
        let net = new network();
        net.request(this, callback);
    }
}
