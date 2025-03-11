import { FXMLHttpRequest } from "../../FAJAX/FXMLHttpRequest.js";

document.addEventListener("DOMContentLoaded", () => {
  const appContainer = document.getElementById("app-container");
  let userIcon = document.getElementById("userIcon");
  let editingRowIndex = null; // Track the index of the row being edited
  let expenses = []; // Array to store all expenses

  // Function that loads all the expenses of the current user.
  const fetchExpensesData = () => {
    const request = new FXMLHttpRequest()
    request.open("GET","/expenses/expenses");
    request.send(null,()=>{
      var respond = JSON.parse(request.responseText);
      if (respond.success) {
        expenses = respond.body;
        loadTemplate("expenses-list-template");
      }else{
        alert(JSON.parse(request.responseText).body);
      }
    })
  }; 
  
  //Loads and displays the specified template, initializing relevant event listeners and functionalities.
  function loadTemplate(templateId){
    const template = document.getElementById(templateId);
    const content = template.content.cloneNode(true);
    appContainer.innerHTML = ""; // Clear current content
    appContainer.appendChild(content);
  
    if (templateId === "expenses-list-template") {
      renderExpensesTable();

      // Handle Expense Analysis button click
      const expenseAnalysisButton = document.getElementById("expense-analysis-button");
      expenseAnalysisButton.addEventListener("click", () => {
        if (expenses.length > 0) {
          loadTemplate("expense-analysis-template");
        } else {
          console.error("No expenses available for analysis.");
        }
      });
  
    } else if (templateId === "add-expense-template") {
      setupAddExpenseForm();
  
    } else if (templateId === "expense-analysis-template") {
      generateExpenseChart(expenses);
      populateMonthDropdown(expenses);
      document.getElementById("month-filter").addEventListener("change", () => {
        generateExpenseChart(expenses);
      });

      // Handle "Back to Expenses" button click
      const backButton = document.getElementById("back-to-expenses");
      if (backButton) {
        backButton.addEventListener("click", () => {
          loadTemplate("expenses-list-template"); // Navigate back to expenses list
        });
      }
    }else if(templateId === "login-template") {
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
  

  // ###############################################################################
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
                fetchExpensesData()
                userIcon.onclick = handleLogout
                userIcon.src = "static/icons/log-out.svg";
                loadTemplate('expenses-list-template')
                
            } else {
                alert("Login failed: " + response.body);
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
                      alert("Registration failed: " + response.body);
                  }
              });
          } else {
              alert("Passwords do not match!");
          }
      }
  };


  function handleLogout() {
    // let currentUser = JSON.parse(localStorage.getItem("currentUser"));
    var request = new FXMLHttpRequest();
    request.open("GET", "/users/currentUser");
    request.send(null, () => {
      let response = JSON.parse(request.responseText);
      if (response.success) {
        let currentUser_ = response.body;
        let confirmLogout = confirm(`${currentUser_.name}, are you sure you want to log out?`);
        if (confirmLogout) {
          let logoutRequest = new FXMLHttpRequest();
          logoutRequest.open("POST", "/usersServer/disconnect");
          logoutRequest.send(null, () => {
              let logoutResponse = JSON.parse(logoutRequest.responseText);
              if (logoutResponse.success) {
                alert("Logout successful!");
                userIcon.src =  "static/icons/user.svg";
                loadTemplate("login-template");
          }else {
              alert("Logout failed: " + logoutResponse.body);
          }
        });
      }
    } else {
      alert(JSON.parse(request.responseText).body);
    }
  });
        
    
    
}

  function pageInitialization(){
    let request = new FXMLHttpRequest();
    request.open("GET", "/users/currentUser");
    request.send(null, () => {
      let response = JSON.parse(request.responseText);
      if (response.success) { // if axis user 
        userIcon.src = "static/icons/log-out.svg"; // Change icon to log-out
        userIcon.onclick = handleLogout
        fetchExpensesData()
        loadTemplate("expenses-list-template");
      } else {
        loadTemplate("login-template");
      }
    });
  }

  pageInitialization()
// ###############################################################################

  // Render the Expenses List table (SORTED by Date & Time)
  const renderExpensesTable = () => {
    const expensesTableBody = document.querySelector("#expense-table tbody");
    expensesTableBody.innerHTML = ""; // Clear the table body

    // Sort expenses by date (latest first) and then by time (earliest first)
    expenses.sort((a, b) => {
      const dateA = convertToSortableDate(a.date, a.time);
      const dateB = convertToSortableDate(b.date, b.time);
      return dateB - dateA; // Sort descending (latest first)
    });

    expenses.forEach((expense, index) => {
      const row = createExpenseRow(expense, index);
      expensesTableBody.appendChild(row);
    });

    const addExpenseButton = document.getElementById("add-expense-button");
    addExpenseButton.addEventListener("click", () => {
      editingRowIndex = null; // Clear editing state
      loadTemplate("add-expense-template");
    });
  };

  // Convert Date & Time to a Sortable Format
  const convertToSortableDate = (date, time) => {
    const [day, month, year] = date.split("/").map(Number);
    const [hours, minutes] = time.split(":").map(Number);
    return new Date(year, month - 1, day, hours, minutes);
  };

  // Set up the Add Expense form
  const setupAddExpenseForm = () => {
    const cancelExpenseButton = document.getElementById("cancel-expense-button");
    cancelExpenseButton.addEventListener("click", () => {
      loadTemplate("expenses-list-template");
    });
  
    const expenseForm = document.getElementById("expense-form");
  
    // Automatically set current date and time if adding a new expense
    if (editingRowIndex === null) {
      const currentDate = new Date();
      const day = String(currentDate.getDate()).padStart(2, "0");
      const month = String(currentDate.getMonth() + 1).padStart(2, "0");
      const year = currentDate.getFullYear();
      const formattedDate = `${year}-${month}-${day}`; // HTML date input format
      const formattedTime = currentDate.toTimeString().slice(0, 5); // HH:MM format
  
      document.getElementById("expense-date").value = formattedDate;
      document.getElementById("expense-time").value = formattedTime;
    }
  
    // Populate form fields if editing
    if (editingRowIndex !== null) {
      const expense = expenses[editingRowIndex];
      document.getElementById("expense-name").value = expense.name;
      document.getElementById("expense-amount").value = expense.amount;
      document.getElementById("expense-category").value = expense.category;
      document.getElementById("expense-date").value = convertDateToInputFormat(expense.date);
      document.getElementById("expense-time").value = expense.time;
    }
  
    // Handle form submission
    expenseForm.addEventListener("submit", (e) => {
      e.preventDefault();
  
      // Get form values
      const name = document.getElementById("expense-name").value;
      const amount = document.getElementById("expense-amount").value;
      const category = document.getElementById("expense-category").value;
      const date = document.getElementById("expense-date").value;
      const time = document.getElementById("expense-time").value;
  
      // Convert date format before saving (YYYY-MM-DD → DD/MM/YYYY)
      const formattedDate = convertDateToDisplayFormat(date);
  
      const newExpense = { name, amount, category, date: formattedDate, time };
      
      if (editingRowIndex !== null) {
        // Update existing expense
        var id = expenses[editingRowIndex].id
        
        var request = new FXMLHttpRequest();
        request.open("PUT","/expenses/expenses/" + id);
        request.send(JSON.stringify(newExpense), () => {
          if(JSON.parse(request.responseText).success){
            expenses[editingRowIndex] = newExpense;
            loadTemplate("expenses-list-template");
          } else {
            alert("Error updating expense: " + JSON.parse(request.responseText).body);
          }
          
        }); 
        editingRowIndex = null; // Clear editing state
      } else {
        // Add new expense
        var request = new FXMLHttpRequest()
        request.open("POST","/expenses/expenses");
        request.send(JSON.stringify(newExpense), () =>{
          if(JSON.parse(request.responseText).success){
            expenses.push(newExpense);
            loadTemplate("expenses-list-template");
          }else{
            alert("Error adding expense: " + JSON.parse(request.responseText).body);
          }
        }); 
        
      }
  
      // Return to Expenses List page
      
    });
  };
  

  // Create a new expense row
  const createExpenseRow = (expense, index) => {
    const { name, amount, category, date, time } = expense;

    const row = document.createElement("tr");
    row.innerHTML = generateExpenseRowHTML(name, amount, category, date, time);

    const editButton = row.querySelector(".edit-expense");
    const deleteButton = row.querySelector(".delete-expense");

    editButton.addEventListener("click", () => editExpense(index));
    deleteButton.addEventListener("click", () => deleteExpense(index));

    return row;
  };

  // Generate HTML for an expense row with SVG icons
  const generateExpenseRowHTML = (name, amount, category, date, time) => {
    return `
      <td>${name}</td>
      <td>$${amount}</td>
      <td>${category}</td>
      <td>${date}</td>
      <td>${time}</td>
      <td>
        <button class="edit-expense" title="Edit">
          <img src="static/icons/edit.svg" alt="Edit" class="action-icon">
        </button>
        <button class="delete-expense" title="Delete">
          <img src="static/icons/trash.svg" alt="Delete" class="action-icon">
        </button>
      </td>
    `;
  };

  // Edit an expense
  const editExpense = (index) => {
    editingRowIndex = index;
    loadTemplate("add-expense-template");
  };

  // Delete an expense
  const deleteExpense = (index) => {
    var id = expenses[index].id
    var request = new FXMLHttpRequest();
    request.open("DELETE","/expenses/expenses/" + id);
    console.log(index);
    console.log(id);
    request.send(null, () => {
      var response = JSON.parse(request.responseText);
      if (response.success) {
        expenses.splice(index, 1); // Remove the expense from the array
        renderExpensesTable();
      }
      else {
        alert("Error: " + response.body)
      }
  }); 

  };
  
});


const convertDateToDisplayFormat = (dateString) => {
  const [year, month, day] = dateString.split("-");
  return `${day}/${month}/${year}`;
};

// Convert "DD/MM/YYYY" → "YYYY-MM-DD" (For HTML input fields)
const convertDateToInputFormat = (dateString) => {
  const [day, month, year] = dateString.split("/");
  return `${year}-${month}-${day}`;
};

let expenseChartInstance = null; // Store the Chart instance globally

const generateExpenseChart = (expenses) => {
  if (!expenses || expenses.length === 0) {
    console.error("No expenses available for analysis.");
    return;
  }

  const canvas = document.getElementById("expenseChart");
  if (!canvas) {
    console.error("Chart container not found.");
    return;
  }

  const ctx = canvas.getContext("2d");
  const selectedMonth = document.getElementById("month-filter").value;

  //  Filter expenses based on selected month
  let filteredExpenses = expenses;
  if (selectedMonth !== "all") {
    filteredExpenses = expenses.filter(expense => {
      const [day, month, year] = expense.date.split("/").map(Number);
      return month === Number(selectedMonth);
    });
  }

  //  If no expenses in selected month, clear chart & show warning
  if (filteredExpenses.length === 0) {
    if (expenseChartInstance) {
      expenseChartInstance.destroy(); // Remove previous chart
    }
    console.warn("No expenses found for the selected month.");
    return;
  }

  // Aggregate filtered expenses by category
  const categoryTotals = filteredExpenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + parseFloat(expense.amount);
    return acc;
  }, {});

  const categories = Object.keys(categoryTotals);
  const totals = Object.values(categoryTotals);

  // Color Palette (Bright Colors)
  const colorPalette = [
    "#FF4D4D", "#4D79FF", "#4DFF4D", "#B366FF", "#FFFF66", "#FFA64D", "#B3B3B3"
  ];

  //  Destroy old chart before creating a new one
  if (expenseChartInstance) {
    expenseChartInstance.destroy();
  }

  // Create the Pie Chart
  expenseChartInstance = new Chart(ctx, {
    type: "pie",
    data: {
      labels: categories,
      datasets: [{
        label: "Total Expenses",
        data: totals,
        backgroundColor: colorPalette.slice(0, categories.length),
      }]
    },
    options: {
      plugins: {
        legend: {
          labels: {
            color: "#FFFFFF",
            font: { size: 14 },
            padding: 20
          },
          position: "top"
        }
      },
    }
  });
};


const populateMonthDropdown = (expenses) => {
  const monthDropdown = document.getElementById("month-filter");
  monthDropdown.innerHTML = '<option value="all">All Expenses</option>'; // Reset

  const months = new Set();
  expenses.forEach(expense => {
    const month = expense.date.split("/")[1]; // Extract month (MM)
    months.add(month);
  });

  // Sort months in order and add to dropdown
  [...months].sort().forEach(month => {
    monthDropdown.innerHTML += `<option value="${month}">${month}</option>`;
  });
};





