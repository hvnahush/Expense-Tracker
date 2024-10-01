import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { UserProvider } from './components/Context/UserProvider';

import Signup from './components/Signup/Signup';
import Login from './components/Login/Login';
import Home from './components/Home/Home';
import Profile from './components/Profile/Profile';
import Navbar from './components/Navbar/Navbar';

const App = () => {
  return (
    <UserProvider>
      <Navbar/>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile/:userId" element={<Profile />} /> 
      </Routes>
    </UserProvider>
  );
};

export default App;
