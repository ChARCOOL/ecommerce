import React from 'react';
import { Spin } from 'antd';
import { Route, Redirect } from 'react-router-dom';

const ProtectedRoute = ({
  isAuth: isAuth,
  component: Component,
  restrictedComponent: RestrictedComponent,
  ...rest
}) => {
  if (isAuth === null)
    return (
      <Spin
        className="text-center m-auto position-absolute"
        size="large"
        style={{
          width: 10,
          height: 10,
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
        }}
      />
    );

  return (
    <Route
      {...rest}
      render={(props) => {
        if (isAuth === 'admin' && !Component) return <RestrictedComponent />;
        else if (isAuth === 'user' || (isAuth === 'admin' && Component)) return <Component />;
        return <Redirect to={{ pathname: '/', state: { from: props.location } }} />;
      }}
    />
  );
};

export default ProtectedRoute;
