import React, { useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { callAPI } from '../utils/apiComp';
import { Context } from '../context/Context';
import { postImgAPI } from '../utils/apiComp';
import Preview from './Preview';
import api from '../utils/apiComp';
const Profile = () => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  let email = userInfo.user.email;
  const [status, setStatus] = useState('');
  const [refresh, setrefresh] = useState(false);
  const { uploadedImages, getUserImages } = useContext(Context);
  let formData = new FormData();

  useEffect(() => {
    let email = userInfo.user.email;
    getUserImages(email);
  }, [refresh]);

  if (!userInfo) return <Navigate to='/login' />;

  const handleFileSelection = async (event) => {
    event.preventDefault();
    if (email) {
      const files = event.target.files;
      for (let i = 0; i < files.length; i++) {
        formData.append('images', files[i]);
      }
      const response = await postImgAPI(`upload/${email}`, formData);
      setStatus(response.message);
      setrefresh(!refresh);
    }
  };

  const handleDelete = async (email) => {
    if (email) {
      const response = await callAPI(`user/remove-images/${email}`);
      const data = await response;
      setrefresh(!refresh);
      console.log(data);
    }
  };

  const deleteAllImages = async (email) => {
    if (email) {
      const response = await callAPI(`user/remove-all-images/${email}`);
      const data = await response;
      console.log(data);
    }
  };
  if (userInfo)
    return (
      <section className='text-gray-600 body-font min-h-screen bg-[#101010] flex flex-col justify-center py-12 sm:px-6 lg:px-8'>
        <div className='container px-5 py-8 mx-auto'>
          <div id='profile-data' className='flex flex-wrap '>
            <div className='details p-8 lg:w-2/3 mx-auto'>
              <div className='h-full bg-[#1c1c20] bg-opacity-75 px-8 pt-16 pb-8 rounded-lg overflow-hidden  relative'>
                <h1 className='title-font sm:text-2xl text-xl font-bold text-gray-200 mb-2 text-center'>
                  User Details
                </h1>
                <div className='leading-relaxed mb-3 '>
                  <p className='text-lg font-semibold inline'>
                    Username: &nbsp;
                  </p>{' '}
                  {userInfo.user.name}
                </div>
                <div className='leading-relaxed mb-3 '>
                  <p className='text-lg font-semibold inline'>Email: &nbsp;</p>{' '}
                  {userInfo.user.email}
                </div>
                <div className='leading-relaxed mb-3'>
                  <p className='text-lg font-semibold inline'>
                    Hashed password: &nbsp;
                  </p>
                  {userInfo.user.password && '*'.repeat(12)}
                </div>
                <div className='text upload flex justify-between'>
                  <input
                    type='file'
                    multiple
                    accept='image/*'
                    onChange={handleFileSelection}
                  />
                  {status && status.includes('successfully') ? (
                    <i className='fa-solid fa-circle-check w-5 h-5'>✅</i>
                  ) : (
                    <i className='fa-solid fa-circle-xmark'>❌</i>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='container px-5 py-8 mx-auto'>
          <div className='flex flex-wrap '>
            <div className='p-8 lg:w-2/3 mx-auto'>
              <div className='h-full bg-[#1c1c20] bg-opacity-75 px-8 pt-16 pb-8 rounded-lg overflow-hidden  relative'>
                <h1 className='title-font sm:text-2xl text-xl font-bold text-gray-200 mb-2 text-center'>
                  Images
                </h1>
                <div className='leading-relaxed mb-3 '>
                  <p className='text-lg font-semibold inline'>
                    Number of Images: &nbsp;
                  </p>{' '}
                  {uploadedImages?.length}
                  <ul className='flex gap-2 justify-around m-5 md:flex-row flex-col'>
                    {uploadedImages?.length > 0 &&
                      uploadedImages?.map((image, index) => (
                        <li key={index}>
                          <ProfileImage image={image} index={index} />
                        </li>
                      ))}
                  </ul>
                  <div className='flex justify-between'>
                    <p
                      className='text-lg cursor-pointer font-semibold inline'
                      onClick={() => deleteAllImages(userInfo.user.email)}
                    >
                      Delete All
                    </p>
                    <p
                      className='text-lg cursor-pointer font-semibold inline'
                      onClick={() => handleDelete(userInfo.user.email)}
                    >
                      Delete Last
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  else {
    alert('User not Loggedin');
    return <Navigate to='/login' />;
  }
};

function ProfileImage({ image, index }) {
  return <Preview image={image} />;
}

export default Profile;
