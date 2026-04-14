let income = 0;
let expense = 0;
let balance = 0;
let transactions = [];

let chart;

function addTransaction() {
  let desc = document.getElementById("desc").value;
  let amount = Number(document.getElementById("amount").value);
  let type = document.getElementById("type").value;

  if (!desc || !amount) return alert("Fill all fields");

  let transaction = {
    id: Date.now(),
    desc,
    amount,
    type
  };

  transactions.push(transaction);
  saveData();
  render();
}

function deleteTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  saveData();
  render();
}

function editTransaction(id) {
  let t = transactions.find(t => t.id === id);

  document.getElementById("desc").value = t.desc;
  document.getElementById("amount").value = t.amount;
  document.getElementById("type").value = t.type;

  deleteTransaction(id);
}

function render() {
  income = 0;
  expense = 0;
  balance = 0;

  let list = document.getElementById("list");
  list.innerHTML = "";

  transactions.forEach(t => {

    if (t.type === "income") {
      income += t.amount;
      balance += t.amount;
    } else {
      expense += t.amount;
      balance -= t.amount;
    }

    let li = document.createElement("li");

    li.innerHTML = `
      ${t.desc} - ₹${t.amount}
      <div class="actions">
        <button onclick="editTransaction(${t.id})">✏️</button>
        <button onclick="deleteTransaction(${t.id})">❌</button>
      </div>
    `;

    list.appendChild(li);
  });

  document.getElementById("income").innerText = income;
  document.getElementById("expense").innerText = expense;
  document.getElementById("balance").innerText = balance;

  updateChart();
  saveData();
}

function saveData() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

function loadData() {
  transactions = JSON.parse(localStorage.getItem("transactions")) || [];
  render();
}

/* DARK MODE */
function toggleTheme() {
  document.body.classList.toggle("dark");
}

/* CHART */
function updateChart() {
  let ctx = document.getElementById("chart");

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Income", "Expense"],
      datasets: [{
        data: [income, expense],
        backgroundColor: ["#00e676", "#ff5252"]
      }]
    }
  });
}

loadData();