document.addEventListener("DOMContentLoaded", () => {
  const appContainer = document.getElementById("app-container");

  // Function to load templates
  const loadTemplate = (templateId) => {
    const template = document.getElementById(templateId);
    const content = template.content.cloneNode(true);
    appContainer.innerHTML = ""; // Clear existing content
    appContainer.appendChild(content);

    // Attach event listeners for switching forms
    if (templateId === "login-template") {
      document.getElementById("register-link").addEventListener("click", (e) => {
        e.preventDefault();
        loadTemplate("register-template");
      });
    } else if (templateId === "register-template") {
      document.getElementById("login-link").addEventListener("click", (e) => {
        e.preventDefault();
        loadTemplate("login-template");
      });
    }
  };

  // Load the login form by default
  loadTemplate("login-template");
});
