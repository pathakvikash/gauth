import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    localStorage.removeItem('isLoggedIn');
    navigate('/login');
    window.location.reload();
  };
  return (
    <nav className='nav py-4 relative md:px-6 px-3 w-full text-[#F1C376]'>
      <div className='container mx-auto flex justify-between items-center'>
        <div className='text-white font-bold text-xl flex '>
          G-<p className='text-[#F1C376]'>Auth</p>
        </div>
        <div className='space-x-4'>
          <a href='/' className='hover:text-gray-300'>
            Home
          </a>
          <a href='/profile' className='hover:text-gray-300'>
            Profile
          </a>
          <button
            onClick={handleLogout}
            className='hover:text-gray-300 focus:outline-none'
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
