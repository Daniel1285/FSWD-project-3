import { FXMLHttpRequest } from "../../FAJAX/FXMLHttpRequest.js";

document.addEventListener("DOMContentLoaded", () => {
    const appContainer = document.getElementById("app-container");

    // Function to load templates
    const loadTemplate = (templateId) => {
        const template = document.getElementById(templateId);
        const content = template.content.cloneNode(true);
        appContainer.innerHTML = ""; // Clear existing content
        appContainer.appendChild(content);

        if (templateId === "login-template") {
            document.getElementById("register-link").addEventListener("click", (e) => {
                e.preventDefault();
                loadTemplate("register-template");
            });

            document.getElementById("login-form").addEventListener("submit", handleLogin);
        } else if (templateId === "register-template") {
            document.getElementById("login-link").addEventListener("click", (e) => {
                e.preventDefault();
                loadTemplate("login-template");
            });

            document.getElementById("register-form").addEventListener("submit", handleRegister);
        }
    };

    // Function to handle login
    const handleLogin = (event) => {
        event.preventDefault();
        const userName = document.getElementById("login-username").value;
        const password = document.getElementById("login-password").value;

        if (userName && password) {
            let user = {
                name: userName,
                password: password
            };

            let sendLogin = new FXMLHttpRequest();
            sendLogin.open("POST", "/users/connect");
            sendLogin.send(JSON.stringify(user), () => {
              console.log(sendLogin.responseText);
                let response = JSON.parse(sendLogin.responseText);
                if (response.success) {
                    alert("Login successful!");
                } else {
                    alert("Login failed: " + response.error);
                }
            });
        }
    };

    // Function to handle registration
    const handleRegister = (event) => {
        event.preventDefault();
        const username = document.getElementById("reg-username").value;
        const email = document.getElementById("reg-email").value;
        const password = document.getElementById("reg-password").value;
        const confirmPassword = document.getElementById("confirm-password").value;

        if (username && email && password && confirmPassword) {
            if (password === confirmPassword) {
                let user = {
                    name: username,
                    email: email,
                    password: password
                };

                let sendRegistration = new FXMLHttpRequest();
                sendRegistration.open("POST", "/users/create");
                sendRegistration.send(JSON.stringify(user), () => {
                    let response = JSON.parse(sendRegistration.responseText);
                    if (response.success) {
                        alert("Registration successful!");
                        loadTemplate("login-template");
                    } else {
                        alert("Registration failed: " + response.error);
                    }
                });
            } else {
                alert("Passwords do not match!");
            }
        }
    };

    // Load the login form initially
    loadTemplate("login-template");
});
