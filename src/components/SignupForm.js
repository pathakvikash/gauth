import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import FormBottom from '../components/Forms/FormBottom';

import FormFields from '../components/Forms/FormFields';
import { Context } from '../context/Context';
import ImageCard from './ImageCard';

const SignupForm = () => {
  const {
    uploadedImages,
    getUserImages,
    staticImages,
    email,
    setEmail,
    handleImageUpload,
    validate,
    selectedPattern,
    handleImageClick,
  } = useContext(Context);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [imagesUploaded, setImagesUploaded] = useState(false);
  const [p1, p2, p3, p4, p5, p6] = staticImages;

  useEffect(() => {
    getUserImages();
  }, [email, imagesUploaded]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    console.log(email, password, selectedPattern, 'selectedPattern');
    if (
      validate({
        email,
        password,
        selectedPattern,
      })
    ) {
      try {
        const response = await fetch('http://localhost:4000/sign-up', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name,
            email,
            password: password.replace('a', '*'),
            pattern: JSON.stringify(selectedPattern),
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
    <div className='max-w-md mx-auto mt-8 p-6 border border-gray-800 rounded-md shadow-md'>
      <h2 className='text-2xl font-semibold mb-4'>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div className='mb-4'>
          <input
            type='text'
            placeholder='Name'
            value={name}
            onChange={(event) => setName(event.target.value)}
            className='w-full px-3 py-2 border bg-slate-900 border-gray-600 rounded-md focus:outline-none focus:border-blue-500'
            required
          />
        </div>
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
            <div className='upload-img'>
              <input
                type='file'
                onChange={handleImageUpload}
                accept='image/*'
                disabled={!/\S+@\S+\.\S+/.test(email)}
                multiple
                className='w-full px-3 py-2 border bg-slate-900 border-gray-600 rounded-md focus:outline-none focus:border-blue-500'
              />
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

      <FormBottom page='signup' responseMessage={responseMessage} />
    </div>
  );
};

export default SignupForm;
