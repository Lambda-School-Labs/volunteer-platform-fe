import React from 'react';
import { Redirect, Route } from 'react-router';
import { useStateValue } from '../hooks/useStateValue';

const SignupRoute = ( { component: Component, ...rest } ) => {
  const [ state ] = useStateValue();
  
  return ( <Route
    { ...rest }
    render={ props => {
      return localStorage.getItem('userRegistered') === "true" ? <Redirect to={ '/' }/> :
        <Component { ...props }/>;
    } }
  /> );
};

export default SignupRoute;