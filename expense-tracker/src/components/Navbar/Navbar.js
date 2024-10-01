import React from 'react';
import './Navbar.css';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className='navbar'>
      <ul className='nav-ul'>
        <li className='logout-item'>
          <button onClick={handleLogout} className='logout-button'>Logout</button>
        </li>
      </ul>
    </div>
  );
};

export default Navbar;
