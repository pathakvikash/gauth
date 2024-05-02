import React, { useState } from 'react';
import { p1, p2, p3, p4, p5, p6 } from '../static/constant';

const SignupForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedPattern, setSelectedPattern] = useState([]);
  const [responseMessage, setResponseMessage] = useState('');
  const [errors, setErrors] = useState({});

  const uploadedImages = [p1, p2, p3, p4, p5, p6];

  const handleImageClick = (imageId) => {
    const newPattern = [...selectedPattern, imageId];
    setSelectedPattern(newPattern);
  };

  const validateForm = () => {
    const errors = {};

    if (!name.trim()) {
      errors.name = 'Name is required';
    }

    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email is invalid';
    }

    if (!password.trim()) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    if (selectedPattern.length === 0) {
      errors.pattern = 'Please select at least one image';
    } else if (selectedPattern.length > 3) {
      errors.pattern = 'Please select no more than 3 images';
    }
    setErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (validateForm()) {
      try {
        const response = await fetch('http://localhost:4000/sign-up', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name,
            email,
            password,
            pattern: selectedPattern,
          }),
        });

        const responseData = await response.json();

        if (response.ok) {
          setResponseMessage('Registration successful');
          alert('Registration successful');
          window.location.href = '/login';
          console.log(responseData);
        } else {
          setResponseMessage(responseData.message);
          console.error(responseData);
        }
      } catch (error) {
        console.error(error);
        setResponseMessage('Something went wrong');
      }
    }
  };

  return (
    <div className='max-w-md mx-auto mt-8 p-6 rounded-md shadow-md'>
      <h2 className='text-2xl font-semibold mb-4'>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div className='mb-4'>
          <input
            type='text'
            placeholder='Name'
            value={name}
            onChange={(event) => setName(event.target.value)}
            className='w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500'
            required
          />
          {errors.name && <div className='text-red-500'>{errors.name}</div>}
        </div>
        <div className='mb-4'>
          <input
            type='email'
            placeholder='Email'
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className='w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500'
            required
          />
          {errors.email && <div className='text-red-500'>{errors.email}</div>}
        </div>
        <div className='mb-4'>
          <input
            type='password'
            placeholder='Password'
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className='w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500'
            required
          />
          {errors.password && (
            <div className='text-red-500'>{errors.password}</div>
          )}
          <div className='pattern mt-4'>
            <p className='mb-4'>
              Please select a pattern by clicking on the images.
            </p>

            <div className='grid grid-cols-3 gap-4'>
              {uploadedImages.map((item, index) => (
                <img
                  key={index}
                  src={item}
                  alt={`item ${index + 1}`}
                  onClick={() => handleImageClick(index + 1)}
                  className='w-24 cursor-pointer rounded-md hover:shadow-md transition duration-300'
                />
              ))}
            </div>
          </div>
        </div>

        <div className='mb-4 '>
          <button
            type='submit'
            className='w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none'
          >
            Sign Up
          </button>
        </div>
      </form>

      <div className='text-sm flex items-center justify-center'>
        <div className='m-2'>Already have an account?</div>
        <a className='text-blue-900' href='/login'>
          Login
        </a>
      </div>
      {responseMessage && (
        <div className='text-blue-500'>{responseMessage}</div>
      )}
    </div>
  );
};

export default SignupForm;
