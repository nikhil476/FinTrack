import React from "react";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Legend,
} from "recharts";

import "./Analytics.css";

import CustomShape, {
    categoryColors,
} from "../components/customShape.jsx";


function Analytics({ transactions }) {

    // Current date information
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();


    // Helper: Get transactions between two dates
    const getTransactionsInRange = (start, end) => {
        return transactions.filter((transaction) => {
            const date = new Date(transaction.date);
            return date >= start && date < end;
        });
    };

    // Helper: Calculate total spending
    const getTotal = (data) => {
        return data.reduce(
            (sum, transaction) => sum + Number(transaction.amount),
            0
        );
    };


    // Helper: Find largest expense
    const getLargestExpense = (data) => {
        if (!data.length) return null;

        return data.reduce((largest, transaction) =>
            Number(transaction.amount) > Number(largest.amount)
                ? transaction
                : largest
        );
    };


    // Helper: Find highest spending category
    const getHighestCategory = (data) => {
        const totals = {};

        data.forEach((transaction) => {
            const category = transaction.category;

            totals[category] =
                (totals[category] || 0) + Number(transaction.amount);
        });

        const highest = Object.entries(totals).sort(
            (a, b) => b[1] - a[1]
        )[0];

        return highest ? highest[0] : "N/A";
    };


    // All-time spending
    const totalSpent = getTotal(transactions);


    // Last three months
    const Months = Array.from({ length: 3 }, (_, index) => {
        const date = new Date(currentYear, currentMonth - 2 + index);

        return date.toLocaleDateString("en-US", {
            month: "short",
        });
    });


    const monthlyData = Months.map((month, index) => {
        const targetDate = new Date(
            currentYear,
            currentMonth - 2 + index
        );

        const start = new Date(
            targetDate.getFullYear(),
            targetDate.getMonth(),
            1
        );

        const end = new Date(
            targetDate.getFullYear(),
            targetDate.getMonth() + 1,
            1
        );

        const monthTransactions = getTransactionsInRange(start, end);

        return {
            month,
            total: getTotal(monthTransactions),
        };
    });


    // Transactions from the last three months
    const recentStart = new Date(
        currentYear,
        currentMonth - 2,
        1
    );

    const recentEnd = new Date(
        currentYear,
        currentMonth + 1,
        1
    );

    const recentTransactions = getTransactionsInRange(
        recentStart,
        recentEnd
    );


    // Category totals for doughnut chart
    const categoryTotals = {};

    recentTransactions.forEach((transaction) => {
        const category = transaction.category;

        categoryTotals[category] =
            (categoryTotals[category] || 0) +
            Number(transaction.amount);
    });


    const categoryData = Object.entries(categoryTotals).map(
        ([category, amount]) => ({
            category,
            amount,
        })
    );


    // Category spending over time
    const categories = Object.keys(categoryTotals);

    const categoryTrendData = Months.map((month, index) => {
        const targetDate = new Date(
            currentYear,
            currentMonth - 2 + index
        );

        const start = new Date(
            targetDate.getFullYear(),
            targetDate.getMonth(),
            1
        );

        const end = new Date(
            targetDate.getFullYear(),
            targetDate.getMonth() + 1,
            1
        );

        const monthTransactions = getTransactionsInRange(start, end);

        const row = { month };

        categories.forEach((category) => {
            row[category] = monthTransactions
                .filter((transaction) => transaction.category === category)
                .reduce(
                    (sum, transaction) =>
                        sum + Number(transaction.amount),
                    0
                );
        });

        return row;
    });


    // Spending periods
    const monthStart = new Date(currentYear, currentMonth, 1);
    const nextMonthStart = new Date(currentYear, currentMonth + 1, 1);

    const previousMonthStart = new Date(currentYear, currentMonth - 1, 1);

    const quarterStart = new Date(
        currentYear,
        Math.floor(currentMonth / 3) * 3,
        1
    );

    const nextQuarterStart = new Date(
        quarterStart.getFullYear(),
        quarterStart.getMonth() + 3,
        1
    );

    const previousQuarterStart = new Date(
        quarterStart.getFullYear(),
        quarterStart.getMonth() - 3,
        1
    );

    const yearStart = new Date(currentYear, 0, 1);
    const nextYearStart = new Date(currentYear + 1, 0, 1);
    const previousYearStart = new Date(currentYear - 1, 0, 1);


    // Current and previous period transactions
    const currentMonthTransactions = getTransactionsInRange(
        monthStart,
        nextMonthStart
    );

    const previousMonthTransactions = getTransactionsInRange(
        previousMonthStart,
        monthStart
    );

    const currentQuarterTransactions = getTransactionsInRange(
        quarterStart,
        nextQuarterStart
    );

    const previousQuarterTransactions = getTransactionsInRange(
        previousQuarterStart,
        quarterStart
    );

    const currentYearTransactions = getTransactionsInRange(
        yearStart,
        nextYearStart
    );

    const previousYearTransactions = getTransactionsInRange(
        previousYearStart,
        yearStart
    );


    // Insights dropdown
    const [insightPeriod, setInsightPeriod] = React.useState("monthly");


    let insightData;
    let previousData;
    let average;


    if (insightPeriod === "monthly") {
        insightData = currentMonthTransactions;
        previousData = previousMonthTransactions;

        average =
            getTotal(insightData) / currentDate.getDate();

    } else if (insightPeriod === "quarterly") {
        insightData = currentQuarterTransactions;
        previousData = previousQuarterTransactions;

        average = getTotal(insightData) / 3;

    } else {
        insightData = currentYearTransactions;
        previousData = previousYearTransactions;

        average = getTotal(insightData) / 12;
    }


    // Insight calculations
    const insightTotal = getTotal(insightData);
    const previousTotal = getTotal(previousData);

    const largestExpense = getLargestExpense(insightData);
    const highestCategory = getHighestCategory(insightData);

    const highestMonth = (() => {
        const monthTotals = {};

        insightData.forEach((transaction) => {
            const date = new Date(transaction.date);

            const month = date.toLocaleDateString("en-US", {
                month: "short",
            });

            monthTotals[month] =
                (monthTotals[month] || 0) +
                Number(transaction.amount);
        });

        const highest = Object.entries(monthTotals).sort(
            (a, b) => b[1] - a[1]
        )[0];

        return highest ? highest[0] : "N/A";
    })();


    const spendingChange = previousTotal === 0
        ? insightTotal > 0
            ? "New spending"
            : "No change"
        : `${Math.abs(
            ((insightTotal - previousTotal) / previousTotal) * 100
        ).toFixed(1)}% ${insightTotal > previousTotal ? "increase" : "decrease"}`;


    // Spending patterns
    const highestRecentCategory = getHighestCategory(recentTransactions);

    const firstMonth = monthlyData[0]?.total || 0;
    const lastMonth = monthlyData[2]?.total || 0;

    const patterns = [];

    if (lastMonth > firstMonth) {
        patterns.push(
            `Your spending has increased compared with ${Months[0]}.`
        );
    } else if (lastMonth < firstMonth) {
        patterns.push(
            `Your spending has decreased compared with ${Months[0]}.`
        );
    } else {
        patterns.push(
            "Your spending is relatively stable across the three months."
        );
    }

    if (highestRecentCategory !== "N/A") {
        patterns.push(
            `${highestRecentCategory} is your highest spending category in the last three months.`
        );
    }

    if (largestExpense) {
        patterns.push(
            `Your largest expense in the selected period is ₹${largestExpense.amount} for ${largestExpense.description}.`
        );
    }


    return (
        <div className="analytics-page">
            <h1>Analytics</h1>
            <p>Track how you spent.</p>

            {transactions.length === 0 ? (
                <div className="monthly-chart">
                    <h3>No spending data yet</h3>
                    <p>Add your first expense to see your analytics here.</p>
                </div>
            ) : (
                <div>

                    {/* Total Spent */}
                    <div className="analytics-card">
                        <h3>Total Spent</h3>
                        <h2>₹{totalSpent.toLocaleString("en-IN")}</h2>
                    </div>


                    {/* Spending Overview */}
                    <div className="monthly-chart">
                        <h3>Spending Overview</h3>
                        <p>last 3 months</p>

                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={monthlyData}>
                                <CartesianGrid
                                    stroke="#e2e8f0"
                                    vertical={false}
                                />

                                <XAxis dataKey="month" />

                                <YAxis />

                                <Tooltip />

                                <Line
                                    type="monotone"
                                    dataKey="total"
                                    stroke="#6366f1"
                                    strokeWidth={3}
                                    dot={{ r: 4, fill: "#6366f1" }}
                                    activeDot={{ r: 7 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Category Spending Over Time */}
                    <div className="monthly-chart">
                        <h3>Category Spending Over Time</h3>
                        <p>last 3 months</p>

                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={categoryTrendData}>
                                <CartesianGrid
                                    stroke="#e2e8f0"
                                    vertical={false}
                                />

                                <XAxis dataKey="month" />

                                <YAxis />

                                <Tooltip />

                                <Legend />

                                {categories.map((category, index) => (
                                    <Line
                                        key={category}
                                        type="monotone"
                                        dataKey={category}
                                        stroke={
                                            categoryColors[
                                            index % categoryColors.length
                                            ]
                                        }
                                        strokeWidth={2}
                                        dot={{ r: 4 }}
                                    />
                                ))}
                            </LineChart>
                        </ResponsiveContainer>
                    </div>


                    {/* Spending Insights */}
                    <div className="monthly-chart">

                        <div className="insights-header">
                            <h3>Spending Insights</h3>

                            <select
                                value={insightPeriod}
                                onChange={(e) =>
                                    setInsightPeriod(e.target.value)
                                }
                            >
                                <option value="monthly">Monthly</option>
                                <option value="quarterly">Quarterly</option>
                                <option value="yearly">Yearly</option>
                            </select>
                        </div>


                        <div className="insights-grid">

                            <div className="insight-item">
                                <span>Total Spending</span>
                                <h3>₹{insightTotal.toLocaleString("en-IN")}</h3>
                            </div>

                            <div className="insight-item">
                                <span>Highest Spending Category</span>
                                <h3>{highestCategory}</h3>
                            </div>

                            <div className="insight-item">
                                <span>
                                    {insightPeriod === "monthly"
                                        ? "Average Daily Spending"
                                        : "Average Monthly Spending"}
                                </span>

                                <h3>₹{average.toFixed(0)}</h3>
                            </div>

                            <div className="insight-item">
                                <span>Highest Spending Month</span>
                                <h3>{highestMonth}</h3>
                            </div>

                            <div className="insight-item">
                                <span>Largest Expense</span>

                                <h3>
                                    {largestExpense
                                        ? `₹${Number(largestExpense.amount).toLocaleString("en-IN")}`
                                        : "N/A"}
                                </h3>

                                {largestExpense && (
                                    <small>{largestExpense.description}</small>
                                )}
                            </div>

                            <div className="insight-item">
                                <span>Change vs Previous Period</span>

                                <h3
                                    className={
                                        insightTotal > previousTotal
                                            ? "spending-increase"
                                            : "spending-decrease"
                                    }
                                >
                                    {spendingChange}
                                </h3>
                            </div>

                        </div>
                    </div>


                    {/* Spending Patterns */}
                    <div className="monthly-chart">
                        <h3>Spending Patterns</h3>

                        <div className="patterns-list">
                            {patterns.map((pattern, index) => (
                                <p key={index}>
                                    <span>•</span> {pattern}
                                </p>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Analytics;