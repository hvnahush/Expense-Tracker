import React, { useEffect, useState } from 'react';
import { useUser } from '../Context/UserProvider';
import { getAuth, sendEmailVerification } from 'firebase/auth';
import './Home.css'; // Import the CSS file

const Home = () => {
  const { userId } = useUser(); // Access userId from context
  const [emailVerified, setEmailVerified] = useState(false);
  const [error, setError] = useState('');
  const [expenses, setExpenses] = useState([]); // State to store expenses
  const [amount, setAmount] = useState(''); // State for expense amount
  const [description, setDescription] = useState(''); // State for expense description
  const [category, setCategory] = useState(''); // State for expense category
  const auth = getAuth();

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await fetch('https://expense-tracker-3da9f-default-rtdb.firebaseio.com/expenses.json');
        if (!response.ok) {
          throw new Error('Failed to fetch expenses');
        }
        const data = await response.json();
        const loadedExpenses = [];

        // Transforming the data into an array of expenses
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
        alert('Verification email sent! Please check your inbox.');
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
        // POST request to Firebase Realtime Database
        const response = await fetch('https://expense-tracker-3da9f-default-rtdb.firebaseio.com/expenses.json', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newExpense),
        });

        if (!response.ok) {
          throw new Error('Failed to add expense');
        }

        // Optionally: Update local expenses state if needed
        setExpenses((prevExpenses) => [...prevExpenses, newExpense]);

        // Reset fields
        setAmount('');
        setDescription('');
        setCategory('');
      } catch (error) {
        setError(error.message);
      }
    } else {
      setError('Please fill out all fields.');
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
                  <select value={category} onChange={(e) => setCategory(e.target.value)} required>
                    <option value="" disabled>Select category</option>
                    <option value="Food">Food</option>
                    <option value="Petrol">Petrol</option>
                    <option value="Salary">Salary</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <button type="submit" className='expense-button'>Add Expense</button>
                {error && <p className="error">{error}</p>}
              </form>

              <div className="expense-list">
                <h2>Your Expenses:</h2>
                {expenses.length === 0 ? (
                  <p>No expenses added yet.</p>
                ) : (
                  <ul>
                    {expenses.map((expense) => (
                      <li key={expense.id}>
                        {expense.amount} - {expense.description} ({expense.category})
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
                <button onClick={sendVerificationEmail} className="verification-button">
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
