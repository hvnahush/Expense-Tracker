import React, { useState } from 'react';
import { auth } from '../Signup/Config'; // Adjust the path as necessary
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useUser } from '../Context/UserProvider'; // Import the context
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Import the CSS file

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setUserId } = useUser(); // Get setUserId from context
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); 

    if (!email || !password) {
      setError('Both fields are mandatory.');
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid; // Get user ID
      setUserId(userId); // Set user ID in context
      console.log('User logged in successfully:', userId);
      navigate('/home'); // Navigate to home
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className='login'>
      <div className='login-container'>
        <h1>LOGIN</h1>
        <form onSubmit={handleSubmit} className='login-field'>
          <input type='email' placeholder='Email Address' value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type='password' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} required />
          {error && <p className='error'>{error}</p>}
          <button type='submit'>Login</button>
        </form>
        <p className='login-login'>
        <p onClick={()=>{navigate('/password')}}>Forgot Password?</p>
          Don't have an account? <span onClick={() => navigate('/signup')}>Sign Up</span>
        </p>
        
      </div>
    </div>
  );
};

export default Login;
