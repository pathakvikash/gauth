import React from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Home from './Home';
import Profile from './components/Profile';
import Navbar from './components/Navbar';
const App = () => {
  const navigate = useNavigate();

  const userInfo = localStorage.getItem('userInfo');
  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    localStorage.removeItem('isLoggedIn');
    navigate('/login');
  };

  let userDetails = JSON.parse(localStorage.getItem('userInfo'));
  return (
    <div className='App '>
      {userDetails && <Navbar onLogout={handleLogout} />}
      <Routes>
        <Route
          exact
          path='/'
          element={
            userInfo ? (
              <Home onLogout={handleLogout} />
            ) : (
              <Navigate to='/login' />
            )
          }
        />
        <Route exact path='/login' element={<Login />} />
        <Route exact path='/sign-up' element={<Signup />} />
        <Route path='/profile' element={<Profile />} />
      </Routes>
    </div>
  );
};

export default App;
