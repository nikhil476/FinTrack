import db from "../db/db.js";

export async function getExpenses(req, res) {
    try {
        const result = await db.query(
            "SELECT * FROM expenses WHERE user_id = $1 ORDER BY date DESC",
            [req.user.id]
        );

        return res.status(200).json({
            expenses: result.rows
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

export async function createExpense(req, res) {
    const { category, description, amount, date } = req.body;

    try {
        const result = await db.query(
            `INSERT INTO expenses (user_id, category, description, amount, date) 
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
             [req.user.id, category, description, amount, date]
        );

        return res.status(201).json({
            message: "Expense added successfully",
            expense: result.rows[0]
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

export async function updateExpense(req, res) {
    const { category, description, amount, date } = req.body;
    const { id } = req.params;

    if (!category || !description || amount === undefined || !date) {
        return res.status(400).json({
            message: "All expense fields are required."
        });
    }

    try{
        const result = await db.query(
            `UPDATE expenses
             SET category = $1, description = $2, amount = $3, date = $4
             WHERE id = $5 AND user_id = $6
            RETURNING *`,
            [category, description, amount, date, id, req.user.id]
        );

        if(result.rows.lenght === 0) {
            return res.status(404).json({
                message: "Expense not found."
            });
        }

        return res.status(200).json({
            message: "Expense updated successfully.",
            expense: result.rows[0]
        });


    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

export async function deleteExpense(req, res) {
    const { id } = req.params;

    try {
        const result = await db.query(
            `DELETE FROM expenses WHERE id = $1 AND user_id = $2 RETURNING *`,
            [id, req.user.id]
        );

        if(result.rows.length === 0) {
            return res.status(404).json({
                message: "Expense Not Found"
            });
        }

        return res.status(200).json({
            message: "Expense is deleted successfully.",
            expense: result.rows[0]
        });

    } catch(err) {
        console.log(err);
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}