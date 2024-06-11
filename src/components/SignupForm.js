import React, { useState, useEffect, useContext } from 'react';
import api from '../utils/apiComp';
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
  const [p1, p2, p3, p4, p5, p6] = staticImages;

  useEffect(() => {
    if (email.length > 6 && email.slice(-3) === 'com') {
      getUserImages(email);
    } else {
      return;
    }
  }, [email]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validate({ name, email, password, selectedPattern })) {
      try {
        const response = await api.post(
          '/sign-up',
          JSON.stringify({
            name,
            email,
            password,
            pattern: JSON.stringify(selectedPattern),
          })
        );

        if (response.status === 201) {
          setResponseMessage('Registration successful');
          window.location.href = '/login';
        } else {
          console.error(response.data);
        }
      } catch (error) {
        setResponseMessage('Something went wrong');
        console.error(error);
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
