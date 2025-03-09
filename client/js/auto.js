import {FXMLHttpRequest} from "../../FAJAX/FXMLHttpRequest.js"

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
      }
    };
  
    // Function to handle login
    const handleLogin = (event) => {
      event.preventDefault();
      const userName = document.getElementById("login-username").value;
      const password = document.getElementById("login-password").value;
      if (userName && password){
        user = {
            name: userName,
            password: password
          }

        // Redirect to dashboard or show success message  
        var sendLogin = new FXMLHttpRequest()
        sendLogin.open("POST", "/users/login")
        sendLogin.send(user, ()=>{
            var response = JSON.parse(sendLogin.responseText); 
            if (response.success){
                alert("Login successful!");
            } else{
                alert("Login failed: " + response.error);
            }
        });
      }
  
    };

        // Function to handle login
    const handleRegister = (event) => {
      event.preventDefault();
      
      const username = document.getElementById("reg-username").value;
      const email = document.getElementById("reg-email").value;
      const password = document.getElementById("reg-password").value;
      const confirmPassword = document.getElementById("confirm-password").value;

      user = {
        name: username,
        email: email,
        password: password
      }
      
      if (username && email && password && confirmPassword){
        if (password === confirmPassword) {
            // Handle registration logic here
            // Redirect to dashboard or show success message
            var sendRegistration = new FXMLHttpRequest()
            sendRegistration.open("POST", "/users/create")
            sendRegistration.send(user, ()=>{
                var response = JSON.parse(sendRegistration.responseText); 
                if (response.success){
                    alert("Registration successful!");
                }else{
                    alert("Registration failed: " + response.error);
                }
            });
        } else {
            alert("Passwords do not match!");
  
      }
  
    };
  
  
  }});
  