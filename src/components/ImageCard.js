const ImageCard = ({ image, index, handleImageClick }) => {
  return (
    <div className='image-card' onClick={() => handleImageClick(index + 1)}>
      <img
        className='w-24 cursor-pointer rounded-md hover:shadow-md transition duration-300'
        src={
          typeof image === 'string'
            ? image
            : `data:image/jpeg;base64,${image.data}`
        } // Check if item is a string (URL) or an object (image data from MongoDB)
        alt={`item ${index + 1}`}
      />
    </div>
  );
};

export default ImageCard;
