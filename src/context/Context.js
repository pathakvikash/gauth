import React, { useState, createContext } from 'react';
import { p1, p2, p3, p4, p5, p6 } from '../static/constant';
import emailjs from '@emailjs/browser';
import { callAPI, postImgAPI } from '../utils/apiComp';
import api from '../utils/apiComp';
export const Context = createContext({
  onLogout: () => {},
});

function AuthProvider({ children }) {
  let userDetails = localStorage.getItem('userInfo');
  const data = [
    {
      title: 'Move beyond the password',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      date: '2022-01-01',
    },
    {
      title: 'The Password Problem',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      date: '2022-01-01',
    },
    {
      title: 'Robust and reliable system',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      date: '2022-01-01',
    },
  ];
  const [errors, setErrors] = useState({});
  const [uploadedImages, setUploadedImages] = useState([]);
  const staticImages = [p1, p2, p3, p4, p5, p6];
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [imagesUploaded, setImagesUploaded] = useState(false);
  const [selectedPattern, setSelectedPattern] = useState([]);

  const handleImageUpload = async (event) => {
    event.preventDefault();
    setImagesUploaded(false);
    let email = userDetails?.user?.email;
    if (!email) {
      console.log('Email is required');
      return;
    }
    if (event && event.target && event.target.files) {
      const files = event.target.files;
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append('images', files[i]);
      }
      const response = await postImgAPI(`upload/${email}`, formData);
      console.log('all set', response);
      setImagesUploaded(true);
    }
  };
  const getUserImages = async (email) => {
    try {
      let response = await callAPI(`get-user-images/${email}`);
      setUploadedImages(response);
    } catch (error) {
      console.error('Error fetching user images:', error);
    }
  };
  const validate = ({ email, password, selectedPattern }) => {
    const errors = {};

    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      console.log('Email is invalid');
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

  const handleImageClick = (imageId) => {
    const newPattern = [...selectedPattern, imageId];
    setSelectedPattern(newPattern);
  };

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
    <Context.Provider
      value={{
        handleImageUpload,
        staticImages,
        userDetails,
        data,
        email,
        setEmail,
        password,
        setPassword,
        getUserImages,
        uploadedImages,
        validate,
        errors,
        setErrors,
        handleImageClick,
        sendEmail,
        selectedPattern,
        setImagesUploaded,
        setSelectedPattern,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export default AuthProvider;
