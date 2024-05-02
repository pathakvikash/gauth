import React, { useState, useEffect } from 'react';
import axios from 'axios';
import emailjs from '@emailjs/browser';
import { p1, p2, p3, p4, p5, p6 } from '../static/constant';

const LoginForm = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedPattern, setSelectedPattern] = useState([]);
  const [responseMessage, setResponseMessage] = useState('');
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [errors, setErrors] = useState({});

  const images = [p1, p2, p3, p4, p5, p6];

  const handleImageClick = (imageId) => {
    const newPattern = [...selectedPattern, imageId];
    setSelectedPattern(newPattern);
  };

  const validateForm = () => {
    const errors = {};

    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email is invalid';
    }

    if (!password.trim()) {
      errors.password = 'Password is required';
    }

    setErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (validateForm()) {
      try {
        const response = await axios.post('http://localhost:4000/login', {
          email,
          password,
          pattern: selectedPattern,
        });

        if (response.status === 200) {
          setResponseMessage('Login successful');
          localStorage.setItem('isLoggedIn', 'true');
          let userInfo = response.data;
          localStorage.setItem('userInfo', JSON.stringify(userInfo));
          onLogin();
        } else {
          setResponseMessage('Invalid email or password');
          setLoginAttempts(loginAttempts + 1);
        }
      } catch (error) {
        if (error.response) {
          setResponseMessage(error.response.data.message);
          setSelectedPattern([]);
          setLoginAttempts(loginAttempts + 1);
        } else {
          setResponseMessage('Something went wrong');
          setLoginAttempts(loginAttempts + 1);
        }
      }
    }
  };

  if (loginAttempts >= 3) {
    sendEmail();
  }
  useEffect(() => emailjs.init(`${process.env.REACT_APP_USER_ID}`), []);

  const sendEmail = () => {
    const serviceId = `${process.env.REACT_APP_SERVICE_ID}`;
    const templateId = `${process.env.REACT_APP_TEMPLATE_ID}`;

    const templateParams = {
      recipeint: email,
      subject: 'Multiple Failed Login Attempts',
      message: `There have been multiple failed login attempts for the email: ${email}. Please review.`,
    };

    emailjs
      .send(serviceId, templateId, templateParams)
      .then((response) => {
        console.log('Email successfully sent!', response.status, response.text);
      })
      .catch((error) => {
        console.error('Failed to send email:', error);
      });
  };

  return (
    <div className='max-w-md mx-auto mt-8 p-6 rounded-md shadow-md'>
      <h2 className='text-2xl font-semibold mb-4'>Login</h2>
      <form onSubmit={handleSubmit}>
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
              {images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`item ${index + 1}`}
                  onClick={() => handleImageClick(index + 1)}
                  className='w-24 cursor-pointer rounded-md hover:shadow-md transition duration-300'
                />
              ))}
            </div>
          </div>
        </div>
        <div className='mb-4'>
          <button
            type='submit'
            className='w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none'
          >
            Login
          </button>
        </div>
      </form>
      <div className='text-sm flex items-center justify-center'>
        <div className='m-2'>Don't have an account?</div>
        <a className='text-blue-500' href='/sign-up'>
          SignUp
        </a>
      </div>
      {responseMessage && (
        <div className='text-blue-500'>{responseMessage}</div>
      )}
    </div>
  );
};

export default LoginForm;
