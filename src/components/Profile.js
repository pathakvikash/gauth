import React, { useContext, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { callAPI } from '../utils/apiComp';
import { Context } from '../context/Context';
import ImageCard from './ImageCard';
const Profile = () => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const { uploadedImages, getUserImages } = useContext(Context);
  const deleteImage = async (id) => {
    const response = await callAPI(`user/remove-images/${id}`);
    const data = await response;
    let userinfo = localStorage.getItem('userInfo');
    userinfo = JSON.parse(userinfo);
    userinfo.user.images = [];
    localStorage.setItem('userInfo', JSON.stringify(userinfo));
    console.log(data);
  };

  useEffect(() => {
    let email = localStorage.getItem('userInfo');
    email = JSON.parse(email);
    email = email.user.email;
    getUserImages(email);
  }, []);

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
                  <ul className='flex gap-2 justify-around m-5 md:flex-row flex-col'>
                    {uploadedImages?.length > 0 &&
                      uploadedImages?.map((image, index) => (
                        <li key={index}>
                          <ImageCard
                            index={index}
                            image={image}
                            deleteImage={deleteImage}
                          />
                        </li>
                      ))}
                  </ul>
                  <p
                    className='text-lg cursor-pointer font-semibold inline'
                    onClick={() => deleteImage(userInfo.user.email)}
                  >
                    Delete all images
                  </p>
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

function Puzzle() {
  let n = 16;
  function fillCell(i) {
    const cell = document.getElementById(`cell-${i + 1}`);
    cell.style.backgroundColor = '#007bff';
  }
  return (
    <div className='board '>
      {Array.from({ length: n }, (_, i) => (
        <div
          id={`cell-${i + 1}`}
          className='cell'
          onClick={() => fillCell(i)}
          key={i}
        >
          {i + 1}
        </div>
      ))}
    </div>
  );
}

export default Profile;
