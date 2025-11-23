// app.js
class ExpenseTracker {
    constructor() {
        this.expenses = [];
        this.categories = [];
        this.currentSection = 'dashboard';
        this.init();
    }

    async init() {
        await this.loadCategories();
        await this.loadExpenses();
        this.setupEventListeners();
        this.renderDashboard();
        this.setupCharts();
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.showSection(link.getAttribute('href').substring(1));
            });
        });

        // Expense form
        document.getElementById('expense-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addExpense();
        });
    }

    async loadCategories() {
        try {
            const response = await fetch('/api/categories');
            this.categories = await response.json();
            this.renderCategorySelect();
        } catch (error) {
            console.error('Error loading categories:', error);
        }
    }

    async loadExpenses() {
        try {
            const response = await fetch('/api/expenses');
            this.expenses = await response.json();
            this.renderExpenseList();
        } catch (error) {
            console.error('Error loading expenses:', error);
        }
    }

    renderCategorySelect() {
        const select = document.getElementById('category-select');
        select.innerHTML = '<option value="">Auto-categorize</option>';
        
        this.categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            select.appendChild(option);
        });
    }

    async addExpense() {
        const form = document.getElementById('expense-form');
        const formData = new FormData(form);
        
        const expense = {
            amount: parseFloat(formData.get('amount')),
            description: formData.get('description'),
            date: formData.get('date'),
            category_id: formData.get('category_id') || null
        };

        try {
            const response = await fetch('/api/expenses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(expense)
            });

            if (response.ok) {
                form.reset();
                await this.loadExpenses();
                this.renderDashboard();
            }
        } catch (error) {
            console.error('Error adding expense:', error);
        }
    }

    renderExpenseList() {
        const container = document.getElementById('expense-list');
        container.innerHTML = '';

        this.expenses.forEach(expense => {
            const category = this.categories.find(c => c.id === expense.category_id);
            const item = document.createElement('div');
            item.className = 'expense-item';
            item.innerHTML = `
                <div class="expense-amount">$${expense.amount.toFixed(2)}</div>
                <div class="expense-description">${expense.description}</div>
                <div class="expense-category" style="background-color: ${category?.color || '#95a5a6'}">
                    ${category?.name || 'Uncategorized'}
                </div>
                <div class="expense-date">${new Date(expense.date).toLocaleDateString()}</div>
            `;
            container.appendChild(item);
        });
    }

    renderDashboard() {
        // Update stats cards with current data
        const monthlySpending = this.calculateMonthlySpending();
        document.querySelector('.stats-cards .card:first-child .amount').textContent = 
            `$${monthlySpending.toFixed(2)}`;
    }

    calculateMonthlySpending() {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        return this.expenses
            .filter(expense => {
                const expenseDate = new Date(expense.date);
                return expenseDate.getMonth() === currentMonth && 
                       expenseDate.getFullYear() === currentYear;
            })
            .reduce((total, expense) => total + expense.amount, 0);
    }

    setupCharts() {
        this.categoryChart = new Chart(
            document.getElementById('category-chart'),
            {
                type: 'doughnut',
                data: {
                    labels: this.categories.map(c => c.name),
                    datasets: [{
                        data: this.categories.map(c => 
                            this.expenses.filter(e => e.category_id === c.id)
                                .reduce((sum, e) => sum + e.amount, 0)
                        ),
                        backgroundColor: this.categories.map(c => c.color)
                    }]
                }
            }
        );

        // Trend chart setup would go here
    }

    showSection(sectionName) {
        // Hide all sections
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });
        
        // Show selected section
        document.getElementById(sectionName).classList.add('active');
        this.currentSection = sectionName;
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ExpenseTracker();
});