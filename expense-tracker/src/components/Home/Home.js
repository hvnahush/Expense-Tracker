import React, { useEffect, useState } from "react";
import { useUser } from "../Context/UserProvider";
import { getAuth, sendEmailVerification } from "firebase/auth";
import "./Home.css"; // Import the CSS file

const Home = () => {
  const { userId } = useUser(); // Access userId from context
  const [emailVerified, setEmailVerified] = useState(false);
  const [error, setError] = useState("");
  const [expenses, setExpenses] = useState([]); // State to store expenses
  const [amount, setAmount] = useState(""); // State for expense amount
  const [description, setDescription] = useState(""); // State for expense description
  const [category, setCategory] = useState(""); // State for expense category
  const [editingExpenseId, setEditingExpenseId] = useState(null); // State to track the expense being edited
  const auth = getAuth();

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await fetch(
          "https://expense-tracker-3da9f-default-rtdb.firebaseio.com/expenses.json"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch expenses");
        }
        const data = await response.json();
        const loadedExpenses = [];

        for (const key in data) {
          loadedExpenses.push({ id: key, ...data[key] });
        }

        setExpenses(loadedExpenses);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchExpenses();

    if (auth.currentUser) {
      setEmailVerified(auth.currentUser.emailVerified);
    }
  }, [auth]);

  const sendVerificationEmail = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        await sendEmailVerification(user);
        alert("Verification email sent! Please check your inbox.");
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (amount && description && category) {
      const newExpense = { amount, description, category };

      try {
        let response;
        if (editingExpenseId) {
          // Update existing expense
          response = await fetch(
            `https://expense-tracker-3da9f-default-rtdb.firebaseio.com/expenses/${editingExpenseId}.json`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(newExpense),
            }
          );

          setExpenses((prevExpenses) =>
            prevExpenses.map((expense) =>
              expense.id === editingExpenseId
                ? { ...expense, ...newExpense }
                : expense
            )
          );
        } else {
          // Create new expense
          response = await fetch(
            "https://expense-tracker-3da9f-default-rtdb.firebaseio.com/expenses.json",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(newExpense),
            }
          );

          if (!response.ok) {
            throw new Error("Failed to add expense");
          }

          const responseData = await response.json();
          setExpenses((prevExpenses) => [
            ...prevExpenses,
            { id: responseData.name, ...newExpense },
          ]);
        }

        // Reset fields
        setAmount("");
        setDescription("");
        setCategory("");
        setEditingExpenseId(null); // Reset editing state
      } catch (error) {
        setError(error.message);
      }
    } else {
      setError("Please fill out all fields.");
    }
  };

  const handleEditExpense = (expense) => {
    setAmount(expense.amount);
    setDescription(expense.description);
    setCategory(expense.category);
    setEditingExpenseId(expense.id); // Set the expense being edited
  };

  const handleDeleteExpense = async (id) => {
    try {
      await fetch(
        `https://expense-tracker-3da9f-default-rtdb.firebaseio.com/expenses/${id}.json`,
        {
          method: "DELETE",
        }
      );

      setExpenses((prevExpenses) =>
        prevExpenses.filter((expense) => expense.id !== id)
      );
    } catch (error) {
      setError("Failed to delete expense");
    }
  };

  return (
    <div className="home-container">
      <h1>Welcome</h1>
      <div className="content">
        {userId ? (
          emailVerified ? (
            <div>
              <form onSubmit={handleAddExpense} className="expense-form">
                <div>
                  <label>Amount Spent:</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                    required
                  />
                </div>
                <div>
                  <label>Description:</label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter description"
                    required
                  />
                </div>
                <div>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                  >
                    <option value="" disabled>
                      Select category
                    </option>
                    <option value="Food">Food</option>
                    <option value="Petrol">Petrol</option>
                    <option value="Salary">Salary</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <button type="submit" className="expense-button">
                  {editingExpenseId ? "Update Expense" : "Add Expense"}
                </button>
                {error && <p className="error">{error}</p>}
              </form>

              <div className="expense-list">
                <h2>Your Expenses:</h2>
                {expenses.length === 0 ? (
                  <p>No expenses added yet.</p>
                ) : (
                  <ul>
                    {expenses.map((expense) => (
                      <li key={expense.id} className="expense-item">
                        <div className="expense-details">
                          {expense.amount} - {expense.description} (
                          {expense.category})
                        </div>
                        <div className="expense-actions">
                          <button
                            onClick={() => handleEditExpense(expense)}
                            className="edit-button"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteExpense(expense.id)}
                            className="delete-button"
                          >
                            Delete
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ) : (
            <div className="verification-message">
              <span>Please verify your email to complete your profile.</span>
              <div className="verification-actions">
                <button
                  onClick={sendVerificationEmail}
                  className="verification-button"
                >
                  Resend Verification Email
                </button>
                {error && <p className="error">{error}</p>}
              </div>
            </div>
          )
        ) : (
          <span>Please log in to complete your profile.</span>
        )}
      </div>
    </div>
  );
};

export default Home;
