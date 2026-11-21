import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import "./Dashboard.css";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Sector, Legend } from "recharts";
import Transactions from "./transactions/Transactions";
import Analytics from "./analytics/Analytics";



const categoryColors = [
    "#65A982", // Muted green
    "#729BCB", // Muted blue
    "#D9A066", // Muted orange
    "#A18BC1", // Muted purple
];

function CustomShape(props) {
    return (
        <Sector
            {...props}
            fill={categoryColors[props.index]}
        />
    );
}



function Dashboard() {
    const [activePage, setActivePage] = useState("dashboard");

    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [expenseData, setExpenseData] = useState({
        amount: "",
        category: "",
        description: ""
    });
    const [transactions, setTransactions] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({});
    const [expensesLoading, setExpensesLoading] = useState(true);
    const [expensesError, setExpensesError] = useState("");
    const [menuOpen, setMenuOpen] = useState(false);

    const navigate = useNavigate();

    async function fetchExpenses() {
        setExpensesLoading(true);
        setExpensesError("");

        try {
            const response = await fetch("https://fintrack-api-da0c.onrender.com/api/expenses", {
                credentials: "include"
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            setTransactions(data.expenses.map(expense => ({
                ...expense,
                amount: Number(expense.amount),
                date: new Date(expense.date).toLocaleDateString("en-US", {
                    timeZone: "UTC",
                    month: "short",
                    day: "numeric",
                    year: "numeric"
                })
            })));

        } catch (err) {
            console.log("Error feetching expenses:", err);
            setExpensesError("Unable to load expenses. Please try again.");
        }
        finally {
            setExpensesLoading(false);
        }
    }

    useEffect(() => {
        fetchExpenses();
    }, []);

    useEffect(() => {
        fetch("https://fintrack-api-da0c.onrender.com/api/auth/me", {
            credentials: "include"
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Not authenticatied");
                }

                return response.json();
            })
            .then(data => {
                setIsAuthenticated(true);
            })
            .catch(error => {
                setIsAuthenticated(false);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <p>Checking authentication...</p>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    async function handleLogout() {
        await fetch("https://fintrack-api-da0c.onrender.com/api/auth/logout", {
            method: "POST",
            credentials: "include"
        });

        navigate("/login");
    }

    const handleDelete = async (id) => {
        try {
            const response = await fetch(
                `https://fintrack-api-da0c.onrender.com/api/expenses/${id}`, {
                method: "DELETE",
                credentials: "include"
            }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            setTransactions(prevTransactions =>
                prevTransactions.filter(transaction => transaction.id !== id)
            );

        } catch (err) {
            console.log("Error deleting expense:", err);
        }
    };

    const handleSave = async (id) => {

        console.log("handleSave triggered", id);

        try {
            const response = await fetch(
                `https://fintrack-api-da0c.onrender.com/api/expenses/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({
                    ...editData,
                    amount: Number(editData.amount)
                })
            }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            console.log(data);

            setTransactions((prevTransactions) =>
                prevTransactions.map((transaction) =>
                    transaction.id === id
                        ? {
                            ...data.expense,
                            amount: Number(data.expense.amount),
                            date: new Date(data.expense.date).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric"
                            })
                        }
                        : transaction
                )
            );

            setEditingId(null);
            setEditData({});

        } catch (err) {
            console.log("Error updating expense", err);
        }
    };

    const handleCloseModal = () => {
        setExpenseData({
            amount: "",
            category: "",
            description: ""
        });

        setIsModalOpen(false);
    }

    const handleAddExpense = async (e) => {
        e.preventDefault();

        if (!expenseData.amount || !expenseData.category || !expenseData.description.trim()) {
            alert("Please fill in all fields.");
            return;
        }

        if (Number(expenseData.amount) <= 0 || !Number.isFinite(Number(expenseData.amount))) {
            alert("Please enter a valid amount greater than zero.");
            return;
        }

        if (Number(expenseData.amount) > 10000000) {
            alert("Amount cannot exceed ₹1 crore.");
            return;
        }

        try {
            const response = await fetch("https://fintrack-api-da0c.onrender.com/api/expenses", {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({
                    ...expenseData,
                    amount: Number(expenseData.amount),
                    date: new Date().toISOString().split("T")[0]
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            console.log(data);
            console.log(data.expense.date);

            setTransactions(prev => [
                ...prev,
                {
                    ...data.expense,
                    amount: Number(data.expense.amount),
                    date: new Date(data.expense.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric"
                    })
                }
            ]);



            setExpenseData({
                amount: "",
                category: "",
                description: ""
            });

            setIsModalOpen(false);

        } catch (err) {
            console.log("Error adding expense:", err);
        }
    };

    const totalSpent = transactions.reduce(
        (total, transaction) => total + Number(transaction.amount), 0
    );

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const monthlySpent = transactions.reduce((total, transaction) => {
        const date = new Date(transaction.date);

        if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
            return total + Number(transaction.amount);
        }

        return total;
    }, 0);

    const transactionCount = transactions.filter(transaction => {
        const date = new Date(transaction.date);

        return date.getMonth() === currentMonth &&
            date.getFullYear() === currentYear;
    }).length;

    console.log(transactions.map(t => ({ date: t.date, amount: t.amount })));

    const spendingData = Array.from({ length: 6 }, (_, index) => {
        const date = new Date();
        date.setDate(1);
        date.setMonth(date.getMonth() - (5 - index));

        const month = date.toLocaleString("en-US", { month: "short" });
        const year = date.getFullYear();
        const monthIndex = date.getMonth();

        const amount = transactions.reduce((total, transaction) => {
            // Parse YYYY-MM-DD without timezone shifting
            const expenseDate = new Date(transaction.date);

            if (
                expenseDate.getFullYear() === year &&
                expenseDate.getMonth() === monthIndex
            ) {
                return total + Number(transaction.amount);
            }

            return total;
        }, 0);

        return { month, amount };
    });

    const categoryData = Object.values(
        transactions.reduce((acc, transaction) => {
            const category = transaction.category;

            acc[category] = acc[category] || { category, amount: 0 };
            acc[category].amount += Number(transaction.amount);

            return acc;
        }, {})
    );

    // Custom legend
    const renderLegend = ({ payload = [] }) => (
        <ul className="custom-legend">
            {payload.map((entry, index) => (
                <li key={index}>
                    <span
                        style={{
                            backgroundColor:
                                categoryColors[index % categoryColors.length],
                        }}
                    />
                    {entry.value}
                </li>
            ))}
        </ul>
    );


    return (
        <div className="dashboard">
            <aside className="sidebar">

                <button
                    className="mobile-menu-btn"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    ☰
                </button>

                <h2>FinTrack</h2>

                <nav className={menuOpen ? "open" : ""}>
                    <button onClick={() => {
                        setActivePage("dashboard");
                        setMenuOpen(false);
                    }}>
                        Dashboard
                    </button>

                    <button onClick={() => {
                        setActivePage("transactions");
                        setMenuOpen(false);
                    }}>
                        Transactions
                    </button>

                    <button onClick={() => {
                        setActivePage("analytics");
                        setMenuOpen(false);
                    }}>
                        Analytics
                    </button>
                </nav>

                <button onClick={handleLogout}>Logout</button>

            </aside>

            <main className="main-content">

                {activePage === "dashboard" && (
                    <div>
                        <header className="dashboard-header">
                            <div>
                                <h1>Dashboard</h1>
                                <p>Track your spendings and understand yout money.</p>
                            </div>

                            <button
                                className="add-expense-btn"
                                onClick={() => setIsModalOpen(true)}
                            >
                                + Add Expense
                            </button>

                        </header>

                        <section>
                            <h2>Welcome back 👋</h2>

                            <div className="summary-cards">
                                <div className="spent-card">
                                    <h2>Total Spent</h2>
                                    <p>₹{totalSpent.toLocaleString("en-IN")}</p>
                                </div>

                                <div className="month-card">
                                    <h2>This Month</h2>
                                    <p>₹{monthlySpent.toLocaleString("en-IN")}</p>
                                </div>

                                <div className="transaction-card">
                                    <h2>Monthly Transactions</h2>
                                    <p>{transactionCount}</p>
                                </div>
                            </div>

                            <div className="charts">
                                <div className="chart-card">
                                    <h2>Spending Trends</h2>

                                    <ResponsiveContainer width="100%" height={300}>
                                        <LineChart data={spendingData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="month" />
                                            <YAxis />
                                            <Tooltip />
                                            <Line
                                                type="monotone"
                                                dataKey="amount"
                                                stroke="#16a34a"
                                                strokeWidth={3}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>

                                <div className="chart-card">
                                    <h2>Category Breakdown</h2>

                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie
                                                data={categoryData}
                                                dataKey="amount"
                                                nameKey="category"
                                                innerRadius={70}
                                                outerRadius={100}
                                                shape={(props) => <CustomShape {...props} />}
                                                label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                                                labelLine={false}
                                            >
                                            </Pie>
                                            <Tooltip />
                                            <Legend content={renderLegend} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            <div className={`transaction-container ${editingId !== null ? "focus-mode" : ""}`}>
                                <div className="transaction-card">
                                    <h2>Recent Transactions</h2>

                                    <div className="transaction-row transaction-header">
                                        <span>Category</span>
                                        <span>Description</span>
                                        <span>Date</span>
                                        <span>Amount</span>
                                        <span>Actions</span>
                                    </div>

                                    {expensesLoading && <p>Loading expenses...</p>}

                                    {expensesError && (
                                        <div>
                                            <p>{expensesError}</p>
                                            <button onClick={fetchExpenses}>Retry</button>
                                        </div>
                                    )}

                                    {!expensesLoading && !expensesError && transactions.length === 0 && (
                                        <p>No expenses yet. Add your first expense!</p>
                                    )}

                                    {[...transactions]
                                        .sort((a, b) => Number(b.id) - Number(a.id))
                                        .slice(0, 3)
                                        .map((transaction) => (
                                            <div
                                                className={`transaction-row ${editingId === transaction.id ? "editing" : ""}`}
                                                key={transaction.id}
                                                onBlur={(e) => {
                                                    if (!e.currentTarget.contains(e.relatedTarget)) {
                                                        handleSave(transaction.id);
                                                    }
                                                }}
                                            >
                                                {editingId === transaction.id ? (
                                                    <select
                                                        value={editData.category}
                                                        onChange={(e) =>
                                                            setEditData({
                                                                ...editData,
                                                                category: e.target.value
                                                            })
                                                        }
                                                    >
                                                        <option value="🍔 Food">🍔 Food</option>
                                                        <option value="🚕 Transport">🚕 Transport</option>
                                                        <option value="🛍️ Shopping">🛍️ Shopping</option>
                                                        <option value="💡 Bills">💡 Bills</option>
                                                    </select>
                                                ) : (
                                                    <span data-label="Category">{transaction.category}</span>
                                                )}

                                                {editingId === transaction.id ? (
                                                    <input
                                                        value={editData.description}
                                                        onChange={(e) =>
                                                            setEditData({
                                                                ...editData,
                                                                description: e.target.value
                                                            })
                                                        }
                                                    />
                                                ) : (
                                                    <span data-label="Description">{transaction.description}</span>
                                                )}

                                                <span data-label="Date">{transaction.date}</span>

                                                {editingId === transaction.id ? (
                                                    <input
                                                        type="number"
                                                        value={editData.amount}
                                                        onChange={(e) =>
                                                            setEditData({
                                                                ...editData,
                                                                amount: e.target.value
                                                            })
                                                        }
                                                    />
                                                ) : (
                                                    <span data-label="Amount">- ₹{transaction.amount}</span>
                                                )}

                                                <div className="transaction-actions">
                                                    <button onClick={() => {
                                                        setEditData({ ...transaction });
                                                        setEditingId(transaction.id);
                                                    }}
                                                        data-label="Actions"
                                                    >✏️</button>
                                                    <button data-label="Actions" onClick={() => handleDelete(transaction.id)}>🗑️</button>
                                                </div>
                                            </div>
                                        ))}

                                    <button
                                        className="view-all-btn"
                                        onClick={() => setActivePage("transactions")}
                                    >
                                        View All Transactions →
                                    </button>

                                </div>
                            </div>
                        </section>
                    </div>
                )}

                {activePage === "transactions" && (
                    <Transactions
                        transactions={transactions}
                        editingId={editingId}
                        editData={editData}
                        setEditData={setEditData}
                        setEditingId={setEditingId}
                        handleSave={handleSave}
                        handleDelete={handleDelete}
                    />
                )}

                {activePage === "analytics" && (
                    <Analytics
                        transactions={transactions}
                    />
                )}

            </main>

            {isModalOpen && (
                <div className="expense-modal">
                    <form
                        className="expense-modal-content"
                        onSubmit={handleAddExpense}
                    >
                        <h2>Add Expense</h2>

                        <div className="form-group">
                            <label>Amount</label>
                            <input
                                type="number"
                                placeholder="Enter Amount"
                                value={expenseData.amount}
                                required
                                min="0.01"
                                max="10000000"
                                step="0.01"
                                onChange={(e) => {
                                    setExpenseData({
                                        ...expenseData,
                                        amount: e.target.value
                                    });
                                }}
                            />
                        </div>

                        <div className="form-group">
                            <label>Category</label>
                            <select
                                value={expenseData.category}
                                required
                                onChange={(e) =>
                                    setExpenseData({
                                        ...expenseData,
                                        category: e.target.value
                                    })
                                }
                            >
                                <option value="">Select category</option>
                                <option value="🍔 Food">🍔 Food</option>
                                <option value="🚕 Transport">🚕 Transport</option>
                                <option value="🛍️ Shopping">🛍️ Shopping</option>
                                <option value="💡 Bills">💡 Bills</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Description</label>
                            <input
                                type="text"
                                placeholder="e.g. Lunch, Uber, Groceries"
                                value={expenseData.description}
                                required
                                minLength={2}
                                maxLength={100}
                                onChange={(e) =>
                                    setExpenseData({
                                        ...expenseData,
                                        description: e.target.value
                                    })
                                }
                            />
                        </div>

                        <button type="submit" className="save-expense-btn">
                            Save Expense
                        </button>


                        <button
                            type="button"
                            className="close-modal-btn"
                            onClick={handleCloseModal}
                        >
                            X
                        </button>
                    </form>
                </div>
            )}

        </div>
    );
}



export default Dashboard;