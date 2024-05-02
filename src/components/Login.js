import React from 'react';
import LoginForm from './LoginForm';
import { p1 } from '../static/constant';

const Login = () => {
  const handleLogin = () => {
    window.location.href = '/';
  };

  return (
    <div className='flex flex-col md:flex-row h-screen'>
      <div className='md:w-1/2 h-full'>
        <img src={p1} alt='p1' className='h-full object-cover' />
      </div>

      <div className='md:w-1/2 bg-white flex justify-center items-center'>
        <LoginForm onLogin={handleLogin} />
      </div>
    </div>
  );
};

export default Login;
