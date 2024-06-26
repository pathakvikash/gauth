import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import SignupForm from './components/SignupForm';
import LoginForm from './components/LoginForm';
import Home from './Home';
import Profile from './components/Profile';
import Navbar from './components/Navbar';
import FormPage from './components/Forms/FormPage';
const App = () => {
  let userDetails = JSON.parse(localStorage.getItem('userInfo'));

  return (
    <div className='App'>
      {userDetails && <Navbar />}
      <Routes>
        <Route
          exact
          path='/'
          element={userDetails ? <Home /> : <Navigate to='/login' />}
        />
        <Route
          exact
          path='/login'
          element={
            <FormPage>
              {' '}
              <LoginForm />{' '}
            </FormPage>
          }
        />
        <Route
          exact
          path='/sign-up'
          element={
            <FormPage>
              <SignupForm />
            </FormPage>
          }
        />
        <Route path='/profile' element={<Profile />} />
        <Route path='/test' element={<FormPage responseMessage={''} />} />
      </Routes>
    </div>
  );
};

export default App;
