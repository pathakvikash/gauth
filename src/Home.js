import React from 'react';
const Home = () => {
  return (
    <div className='min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8'>
      <div className='flex flex-col md:flex-row items-center justify-center md:items-start'>
        <div className='w-full md:w-2/5 lg:w-3/5 mb-8 md:mb-0'>
          <img
            src='https://media.licdn.com/dms/image/D4D12AQGBFci8vLZ1vA/article-cover_image-shrink_600_2000/0/1708949660332?e=2147483647&v=beta&t=_WaP-Pcb2u2ihVxlwIAyFyXW8hhy5bMSy1hHFaJFjGs'
            alt='p1'
            className='w-full h-full p-3  object-cover'
          />
        </div>
        <div className='w-full md:w-3/5 lg:w-2/5 mx-auto md:mx-0'>
          <div className='container mx-auto py-8'>
            <h1 className='text-3xl font-bold mb-4 text-center md:text-left'>
              Graphical Authentication System
            </h1>
            <p className='text-lg mb-6 text-center md:text-left'>
              Graphical authentication is a method of authentication that uses
              images or patterns to verify a user's identity. It offers a
              user-friendly alternative to traditional text-based passwords.
            </p>
            <h2 className='text-2xl font-bold mb-2'>Features:</h2>
            <ul className='list-disc pl-6 mb-6'>
              <li>Secure and user-friendly authentication method</li>
              <li>Resistance to brute-force attacks</li>
              <li>Adaptable for various devices and screen sizes</li>
              <li>Customizable patterns for individual users</li>
            </ul>
            <h2 className='text-2xl font-bold mb-2'>How It Works:</h2>
            <ol className='list-decimal pl-6 mb-6'>
              <li>
                Users select a set of images or patterns as their password.
              </li>
              <li>
                During login, users must recreate the selected pattern to gain
                access.
              </li>
              <li>
                The system validates the pattern against the stored user
                profile.
              </li>
              <li>
                Upon successful validation, the user is granted access to the
                application.
              </li>
            </ol>
            <p className='text-lg text-center md:text-left'>
              Graphical authentication systems offer a balance between security
              and usability, providing an intuitive way for users to
              authenticate their identities.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
