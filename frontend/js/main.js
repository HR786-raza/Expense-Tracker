const API_URL = 'http://localhost:5000/api/expenses';
const AUTH_URL = 'http://localhost:5000/api/auth';
let token = localStorage.getItem('token') || '';

const form = document.getElementById('expense-form');
const tableBody = document.querySelector('#expense-table tbody');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('expense-id').value;
    const data = {
        title: document.getElementById('title').value,
        amount: parseFloat(document.getElementById('amount').value),
        category: document.getElementById('category').value,
        date: document.getElementById('date').value
    };

    const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };

    if (id) {
        await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers,
            body: JSON.stringify(data)
        });
    } else {
        await fetch(API_URL, {
            method: 'POST',
            headers,
            body: JSON.stringify(data)
        });
    }
    form.reset();
    fetchExpenses();
});

async function fetchExpenses() {
    const res = await fetch(API_URL, { headers: { 'Authorization': `Bearer ${token}` } });
    const data = await res.json();
    renderTable(data);
    updateCharts(data);
}

function renderTable(data) {
    tableBody.innerHTML = '';
    data.forEach(exp => {
        const row = `<tr>
            <td>${exp.title}</td>
            <td>${exp.amount}</td>
            <td>${exp.category}</td>
            <td>${exp.date}</td>
            <td>
                <button onclick="editExpense(${exp.id}, '${exp.title}', ${exp.amount}, '${exp.category}', '${exp.date}')">Edit</button>
                <button onclick="deleteExpense(${exp.id})">Delete</button>
            </td>
        </tr>`;
        tableBody.innerHTML += row;
    });
}

function editExpense(id, title, amount, category, date) {
    document.getElementById('expense-id').value = id;
    document.getElementById('title').value = title;
    document.getElementById('amount').value = amount;
    document.getElementById('category').value = category;
    document.getElementById('date').value = date;
}

async function deleteExpense(id) {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
    fetchExpenses();
}

function applyFilters() {
    const category = document.getElementById('filter-category').value;
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;
    let url = `${API_URL}/filter?`;

    if (category) url += `category=${category}&`;
    if (startDate && endDate) url += `startDate=${startDate}&endDate=${endDate}`;

    fetch(url, { headers: { 'Authorization': `Bearer ${token}` } })
        .then(res => res.json())
        .then(data => {
            renderTable(data);
            updateCharts(data);
        });
}

function clearFilters() {
    document.getElementById('filter-category').value = '';
    document.getElementById('start-date').value = '';
    document.getElementById('end-date').value = '';
    fetchExpenses();
}

function exportToExcel() {
    const token = localStorage.getItem('token');
    fetch(`${API_URL}/export/excel`, {
        headers: { Authorization: `Bearer ${token}` }
    })
        .then(res => res.blob())
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'expenses.xlsx';
            document.body.appendChild(a);
            a.click();
            a.remove();
        });
}

function exportToPDF() {
    const token = localStorage.getItem('token');
    fetch(`${API_URL}/export/pdf`, {
        headers: { Authorization: `Bearer ${token}` }
    })
        .then(res => res.blob())
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'expenses.pdf';
            document.body.appendChild(a);
            a.click();
            a.remove();
        });
}

function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch(`${AUTH_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    })
        .then(res => res.json())
        .then(data => {
            token = data.token;
            localStorage.setItem('token', token);
            fetchExpenses();
        });
}

function signup() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch(`${AUTH_URL}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    })
        .then(() => login());
}

function logout() {
    token = '';
    localStorage.removeItem('token');
    tableBody.innerHTML = '';
}

fetchExpenses();