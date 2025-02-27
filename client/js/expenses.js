document.addEventListener("DOMContentLoaded", () => {
  const appContainer = document.getElementById("app-container");
  let editingRowIndex = null; // Track the index of the row being edited
  let expenses = []; // Array to store all expenses

  // Fetch expenses data from JSON file
  const fetchExpensesData = () => {
    fetch("../../server/data.json") // Correct relative path
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to fetch expenses: ${response.statusText}`);
        }
        return response.json();
      })
      .then(data => {
        expenses = data; // Corrected: Now assigns the fetched data to the global expenses array
        loadTemplate("expenses-list-template"); // Render the table
      })
      .catch(error => console.error("Error loading expenses:", error));
  };
  

  const loadTemplate = (templateId) => {
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
      // ✅ Handle "Back to Expenses" button click
      const backButton = document.getElementById("back-to-expenses");
      if (backButton) {
        backButton.addEventListener("click", () => {
          loadTemplate("expenses-list-template"); // Navigate back to expenses list
        });
      }
    }
  };
  

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
        expenses[editingRowIndex] = newExpense;
        editingRowIndex = null; // Clear editing state
      } else {
        // Add new expense
        expenses.push(newExpense);
      }
  
      // Return to Expenses List page
      loadTemplate("expenses-list-template");
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
          <img src="../static/icons/edit.svg" alt="Edit" class="action-icon">
        </button>
        <button class="delete-expense" title="Delete">
          <img src="../static/icons/trash.svg" alt="Delete" class="action-icon">
        </button>
      </td>
    `;
  };

  // Edit an expense
  const editExpense = (index) => {
    editingRowIndex = index; // Track the index being edited
    loadTemplate("add-expense-template");
  };

  // Delete an expense
  const deleteExpense = (index) => {
    expenses.splice(index, 1); // Remove the expense from the array
    renderExpensesTable(); // Re-render the table
  };

  // Load the Expenses List template by default and fetch data
  fetchExpensesData(); // Fetch JSON data
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

const generateExpenseChart = (expenses) => {
  if (!expenses || expenses.length === 0) {
    console.error("No expenses available for analysis.");
    return;
  }

  // Ensure the canvas element exists
  const canvas = document.getElementById("expenseChart");
  if (!canvas) {
    console.error("Chart container not found.");
    return;
  }

  const ctx = canvas.getContext("2d");

  // Aggregate expenses by category
  const categoryTotals = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + parseFloat(expense.amount);
    return acc;
  }, {});

  const categories = Object.keys(categoryTotals);
  const totals = Object.values(categoryTotals);

  const colorPalette = [
    "#FF4D4D", // Bright Red
    "#4D79FF", // Bright Blue
    "#4DFF4D", // Bright Green
    "#B366FF", // Bright Purple
    "#FFFF66", // Bright Yellow
    "#FFA64D", // Bright Orange
    "#B3B3B3"  // Bright Gray
  ];
  
  
  new Chart(ctx, {
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
            font: {
              size: 14, 
            },
            padding: 20, 
          },
          position: "top", // ✅ Move legend above the chart
        }
      },
    }
  });
};
