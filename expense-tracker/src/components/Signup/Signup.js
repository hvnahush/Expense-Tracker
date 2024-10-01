import React, { useState } from 'react';
import { auth } from './Config'; // Adjust the path as necessary
import { createUserWithEmailAndPassword } from 'firebase/auth';
import './Signup.css';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate =useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission

    if (!email || !password || !confirmPassword) {
      setError('All fields are mandatory.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      console.log('User has successfully signed up: ' + email);
      navigate('/login');
   
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogin = () => {
    navigate('/login')
  };

  return (
    <div className='signup'>
      <div className='signup-container'>
        <h1>SIGN UP</h1>
        <form onSubmit={handleSubmit}>
          <div className='signup-field'>
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
            <input 
              type='password' 
              placeholder='Confirm Password' 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              required
            />
          </div>
          {error && <p className='error'>{error}</p>}
          <button type='submit'>Signup</button>
        </form>
        <p className='signup-login'>
          Already have an account? <span onClick={handleLogin}>Login here</span>
        </p>
      </div>
    </div>
  );
};

export default Signup;