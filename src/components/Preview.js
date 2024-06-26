import React, { useState } from 'react';

const Preview = ({ image }) => {
  const [showPreview, setShowPreview] = useState(false);
  const src =
    typeof image == 'string' && image.startsWith('/static')
      ? image
      : `data:image/jpeg;base64,${image.data}`;

  return (
    <>
      <img
        className='w-24 cursor-pointer rounded-md hover:shadow-md transition duration-300'
        src={src}
        alt={`Image Preview`}
        onClick={() => setShowPreview(true)}
      />
      {showPreview && (
        <div
          id='preview'
          className='fixed inset-0 flex justify-center items-center bg-black bg-opacity-75'
        >
          <div className='bg-white relative p-4 flex rounded'>
            <img
              className='object-cover w-[600px] h-full overflow-visible cursor-pointer rounded-md hover:shadow-md transition duration-300'
              src={src}
              alt='Image Preview'
              onClick={() => setShowPreview(false)}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Preview;
