import React, { useState, useEffect, useContext } from 'react';
import FormFields from './Forms/FormFields';
import ImageCard from './ImageCard';
import { Context } from '../context/Context';

import api from '../utils/apiComp';
import emailjs from '@emailjs/browser';
import FormBottom from '../components/Forms/FormBottom';
const LoginForm = ({ onLogin }) => {
  const {
    staticImages,
    email,
    validate,
    setEmail,
    getUserImages,
    uploadedImages,
    handleImageClick,
    selectedPattern,
    setSelectedPattern,
    sendEmail,
  } = useContext(Context);
  const [password, setPassword] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [loginAttempts, setLoginAttempts] = useState(0);

  const [p1, p2, p3, p4, p5, p6] = staticImages;

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      validate({
        email,
        password,
        selectedPattern,
      })
    ) {
      try {
        const response = await api.post(`/login`, {
          email,
          password,
          pattern: selectedPattern,
        });

        if (response.status === 200) {
          setResponseMessage('Login successful');
          let userInfo = response.data;
          localStorage.setItem('isLoggedIn', 'true');

          localStorage.setItem(
            'userInfo',
            JSON.stringify({
              user: {
                email: userInfo.user.email,
                name: userInfo.user.name,
                id: userInfo.user._id,
              },
              token: userInfo.token,
            })
          );
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
          console.log(error, 'Something went wrong');
          setResponseMessage('Something went wrong');
          setLoginAttempts(loginAttempts + 1);
        }
      }
    }
  };

  useEffect(() => emailjs.init(`${process.env.REACT_APP_USER_ID}`), []);

  if (loginAttempts >= 3) {
    sendEmail();
  }

  useEffect(() => {
    if (email.length > 6 && email.slice(-3) === 'com') {
      getUserImages(email);
    } else {
      return;
    }
  }, [email]);

  return (
    <div className='max-w-md mx-auto mt-8 p-6 border border-gray-800 rounded-md shadow-md'>
      <h2 className='text-2xl font-semibold mb-4'>Login</h2>
      <form>
        <div className='mb-4'>
          <FormFields
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
          />
        </div>
        <div className='mb-4'>
          <div className='pattern mt-4'>
            <p className='mb-4'>
              Please select a pattern by clicking on the images.
            </p>
            <div className='grid grid-cols-3 gap-4'>
              {(uploadedImages?.length > 0
                ? uploadedImages
                : [p1, p2, p3, p4, p5, p6]
              ).map((item, index) => (
                <div key={index}>
                  <ImageCard
                    index={index}
                    image={item}
                    handleImageClick={handleImageClick}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className='mb-4'>
          <button
            onClick={handleSubmit}
            className='w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none'
          >
            Login
          </button>
        </div>
      </form>
      <FormBottom page='login' responseMessage={responseMessage} />
    </div>
  );
};

export default LoginForm;
