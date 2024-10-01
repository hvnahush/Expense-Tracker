import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../Context/UserProvider';
import { getAuth, sendEmailVerification } from 'firebase/auth';

const Home = () => {
  const { userId } = useUser(); // Access userId from context
  const [emailVerified, setEmailVerified] = useState(false);
  const [error, setError] = useState('');
  const auth = getAuth();

  useEffect(() => {
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

  return (
    <div>
      <h1>Welcome</h1>
      <p>
        Your profile is incomplete. 
        {userId ? (
          emailVerified ? (
            <Link to={`/profile/${userId}`}>
              Please complete Now
            </Link>
          ) : (
            <div>
              <span>Please verify your email to complete your profile.</span>
              <div>
                <button onClick={sendVerificationEmail}>
                  Resend Verification Email
                </button>
                {error && <p className="error">{error}</p>}
              </div>
            </div>
          )
        ) : (
          <span>Please log in to complete your profile.</span>
        )}
      </p>
    </div>
  );
};

export default Home;
