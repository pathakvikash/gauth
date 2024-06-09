import React, { useContext } from 'react';
// import CryptoJS from 'crypto-js';
import { Context } from '../../context/Context';

const FormFields = ({ email, password, setEmail, setPassword }) => {
  // const encrypted = CryptoJS.AES.encrypt(password, 'secret-key').toString();

  const { errors } = useContext(Context);
  return (
    <div className='form-group'>
      <div className='mb-4'>
        <input
          type='email'
          placeholder='Email'
          className='w-full px-3 py-2 border bg-slate-900 border-gray-600 rounded-md focus:outline-none focus:border-blue-500'
          id='email'
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        {errors.email && <div className='text-red-500'>{errors.email}</div>}
      </div>
      <div className='mb-4'>
        <input
          type='password'
          placeholder='Password'
          className='w-full px-3 py-2 border bg-slate-900 border-gray-600 rounded-md focus:outline-none focus:border-blue-500'
          id='password'
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
        {errors.password && (
          <div className='text-red-500'>{errors.password}</div>
        )}
      </div>
    </div>
  );
};

export default FormFields;
