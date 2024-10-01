import React, { useState } from 'react';
import './Login.css';
import { auth } from '../Signup/Config'; 
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); 

    if (!email || !password) {
      setError('Both fields are mandatory.');
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('User logged in successfully: ' + email);
      navigate('/home'); 
    } catch (err) {
      setError(err.message); 
    }
  };

  const handleSignup = () => {
    navigate('/signup');
  };

  return (
    <div className='login'>
      <div className='login-container'>
        <h1>LOGIN</h1>
        <form onSubmit={handleSubmit}>
          <div className='login-field'>
            <input
              type='email'
              placeholder='Email Address'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type='password'
              placeholder='Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className='error'>{error}</p>} {/* Display error message */}
          <button type='submit'>Login</button>
        </form>
        <p className='login-login'>
          Don't have an account? <span onClick={handleSignup}>Signup here</span>
        </p>
      </div>
    </div>
  );
};

export default Login;
