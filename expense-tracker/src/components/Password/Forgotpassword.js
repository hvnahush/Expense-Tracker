import React, { useState } from 'react';
import { auth } from '../Signup/Config'; // Adjust the path as necessary
import { sendPasswordResetEmail } from 'firebase/auth';
import './Forgotpassword.css'; // Make sure to import your CSS file

const Forgotpassword = () => {
  const [error, setError] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [showResetModal, setShowResetModal] = useState(true);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!resetEmail) {
      setError('Please enter your email.');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, resetEmail);
      alert('Password reset email sent!');
      setShowResetModal(false); // Close the modal
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      {showResetModal && (
        <div className='reset-modal'>
          <div className='modal-content'>
            <span className='close' onClick={() => setShowResetModal(false)}>&times;</span>
            <h2>Reset Password</h2>
            <form onSubmit={handleResetPassword}>
              <input 
                type='email' 
                placeholder='Enter your email' 
                value={resetEmail} 
                onChange={(e) => setResetEmail(e.target.value)} 
                required 
              />
              {error && <p className='error'>{error}</p>}
              <button type='submit'>Send Reset Email</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Forgotpassword;
