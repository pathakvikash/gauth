import React from 'react';
import { p1 } from '../../static/constant';
export default function FormPage({ children }) {
  return (
    <div className='flex flex-col md:flex-row h-screen'>
      <div className='md:w-1/2 h-full'>
        <img src={p1} alt='p1' className='h-full object-cover' />
      </div>

      <div className='md:w-1/2 bg-[#101010] text-white flex justify-center items-center'>
        {children}
      </div>
    </div>
  );
}
