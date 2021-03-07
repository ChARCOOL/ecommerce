import React, { useState, useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { auth } from './firebase';

import NotFound from './components/NotFound';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Product from './pages/Product';
import Header from './components/Header';
import ResetPassword from './pages/auth/ResetPassword';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import RegisterComplete from './pages/auth/RegisterComplete';

import UserDashboard from './pages/user/UserDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';

import { currentUser } from './utils/auth';
import Checkout from './pages/Checkout';

const App = () => {
  const dispatch = useDispatch();

  const [isAuth, setIsAuth] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const token = (await user.getIdTokenResult()).token;

        currentUser(token).then((res) => {
          dispatch({
            type: 'LOGGED_IN',
            payload: {
              name: res.data.user.name,
              picture: res.data.user.picture,
              email: res.data.user.email,
              token,
              role: res.data.user.role,
              _id: res.data.user._id,
              country: res.data.user.country,
              phone: res.data.user.phone,
              city: res.data.user.city,
              address: res.data.user.address,
              zip: res.data.user.zip,
            },
          });

          dispatch({
            type: 'ADD_PRODUCT',
            payload: res.data.user.cart,
          });

          if (res.data.user.role === 'admin') setIsAuth('admin');
          else if (res.data.user.role === 'user') setIsAuth('user');
        });
      } else {
        dispatch({ type: 'NOT_LOGGED_IN', payload: NaN });

        setIsAuth('');
      }
    });
    return () => unsubscribe();
  }, [dispatch]);

  return (
    <>
      <ToastContainer autoClose={1500} />
      <Header />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/product/*" component={Product} />
        <Route exact path="/checkout" component={Checkout} />
        <ProtectedRoute exact path="/reset-password" component={ResetPassword} isAuth={!isAuth} />
        <ProtectedRoute
          exact
          path="/register/complete"
          component={RegisterComplete}
          isAuth={!isAuth}
        />
        <ProtectedRoute exact path="/user/dashboard" component={UserDashboard} isAuth={isAuth} />
        <ProtectedRoute
          exact
          path="/admin/dashboard"
          restrictedComponent={AdminDashboard}
          isAuth={isAuth}
        />
        <Route component={NotFound} />
      </Switch>
    </>
  );
};

export default App;
