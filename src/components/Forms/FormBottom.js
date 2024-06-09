function FormBottom({ page, responseMessage }) {
  return (
    <div>
      <div className='text-sm flex items-center justify-center'>
        <div className='m-2'>
          {page == 'login'
            ? "Don't have an account?"
            : 'Already have an account?'}
        </div>
        <a
          className='text-blue-500'
          href={page == 'login' ? `/sign-up` : `/login`}
        >
          {page == 'login' ? 'Sign Up' : 'Login'}
        </a>
      </div>
      {responseMessage && (
        <div className='text-blue-500'>{responseMessage}</div>
      )}
    </div>
  );
}

export default FormBottom;
