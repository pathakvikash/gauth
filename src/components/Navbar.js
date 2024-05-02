import React from 'react';

const Navbar = ({ onLogout }) => {
  return (
    <nav className='bg-blue-500 py-4 fixed w-full'>
      <div className='container mx-auto flex justify-between items-center'>
        <div className='text-white font-bold text-xl'>G-Auth</div>
        <div className='space-x-4'>
          <a href='/' className='text-white hover:text-gray-300'>
            Home
          </a>
          <a href='/profile' className='text-white hover:text-gray-300'>
            Profile
          </a>
          <button
            onClick={onLogout}
            className='text-white hover:text-gray-300 focus:outline-none'
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
