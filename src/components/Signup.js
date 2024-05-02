import React from 'react';
import SignupForm from './SignupForm';
import { p1 } from '../static/constant';

const Signup = () => {
  return (
    <div className='flex flex-col md:flex-row h-screen'>
      <div className='md:w-1/2 h-full'>
        <img src={p1} alt='p1' className='h-full object-cover' />
      </div>

      <div className='md:w-1/2 bg-white flex justify-center items-center'>
        <SignupForm />
      </div>
    </div>
  );
};

export default Signup;
