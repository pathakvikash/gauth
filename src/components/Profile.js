import React from 'react';
import { Navigate } from 'react-router-dom';

const Profile = () => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  if (userInfo)
    return (
      <section className='text-gray-600 body-font min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8'>
        <div className='container px-5 py-8 mx-auto'>
          <div className='flex flex-wrap '>
            <div className='p-8 lg:w-2/3 mx-auto'>
              <div className='h-full bg-gray-100 bg-opacity-75 px-8 pt-16 pb-8 rounded-lg overflow-hidden  relative'>
                <h1 className='title-font sm:text-2xl text-xl font-bold text-gray-900 mb-2 text-center'>
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
                  {userInfo.user.password &&
                    '*'.repeat(userInfo.user.password.length)}
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

export default Profile;
