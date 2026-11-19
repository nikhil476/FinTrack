function Transactions({
    transactions,
    editingId,
    editData,
    setEditData,
    setEditingId,
    handleSave,
    handleDelete
}) {

    return (
        <div className="transaction-container">
            <div className="transaction-card">
                <h1>All Transactions</h1>
                <p>See where your money goes.</p>

                {transactions.length === 0 ? (
                    <p>No transactions yet. Add your first expense!</p>
                ) : (
                    [...transactions]
                        .sort((a, b) => Number(b.id) - Number(a.id))
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
                        )))}
            </div>
        </div>
    );
}

export default Transactions;