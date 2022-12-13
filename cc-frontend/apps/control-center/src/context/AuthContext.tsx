import { createContext, useState, useEffect } from 'react';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';
import jwt_decode from 'jwt-decode';

import url_backend from '../configs/url';

// Interface used to create context
export interface IAuth {
  user: any;
  authTokens: any;
  usertoken?: string;
  setUser: (usertoken: string) => void;
  setAuthTokens: (usertoken: string) => void;
  registerUser: (username, password, password2) => void;
  loginUser: (username, password) => void;
  logoutUser: () => void;
}

// We are basically creating a AuthContext, We will be able to import it into any file
// present in src folder. We will be able to access contextData using it.
// We will basically wrap the entire app inside AuthProvider.

export const AuthContext = createContext<IAuth>({} as IAuth);
export const AuthProvider = ({ children }) => {
  const usertoken = localStorage.getItem('authTokens');
  const [authTokens, setAuthTokens] = useState(() =>
    usertoken !== null ? JSON.parse(usertoken) : ''
  );
  const [user, setUser] = useState(() =>
    usertoken !== null ? jwt_decode(usertoken) : ''
  );

  const [loading, setLoading] = useState(true);

  const history = useNavigate();

  // backend for login
  const url = url_backend + '/api/auth/token/';

  // loginUser — Requires username and passwords. If the user is present is the database
  // (credentials are valid), the user is logged in. Tokens (access & refresh) are stored
  // in local storage,
  const loginUser = async (username, password) => {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    const data = await response.json();

    if (response.status === 200) {
      setAuthTokens(data);
      setUser(jwt_decode(data.access));
      localStorage.setItem('authTokens', JSON.stringify(data));
      alert('Login successful');

      history('/app/controlcenter/Home');

      // to set current user datain the backend
      getUserData(data);
    } else {
      alert(JSON.stringify(data));
    }
  };

  // calls api/user to set current user in the backend everytime a user logs into the application
  const getUserData = async (tokendata) => {
    const url = url_backend + '/api/user/';
    console.log(authTokens);
    try {
      const data = await axios({
        method: 'get',
        url: url,
        headers: { Authorization: `Bearer ${tokendata['access']}` },
      });

      console.log('user', JSON.stringify(data.data));
    } catch (e) {
      console.log(e);
    }
  };

  // registerUser — Requires username, password1, password2. This function registers the user
  // in the database. Unique username, password match checks are done on backend. If the
  // registration request is successful, then the user is redirected to a login page.
  const url2 = url_backend + '/api/auth/register/';

  const registerUser = async (username, password, password2) => {
    const response = await fetch(url2, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
        password2,
      }),
    });
    if (response.status === 201) {
      history('/app/controlceter/login');
    } else {
      alert('Something is Wrong!');
    }
  };

  // logoutUser — Simply logs the user out & clears the local storage.
  // Whenever authTokens& state of loadingis changed. User state in changed
  // (useEffect is causing this change). jwt_decode just decodes an access token.
  const logoutUser = () => {
    alert(JSON.stringify(user) + 'Logout Successful.');
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem('authTokens');

    history('/app/controlcenter/login');
  };

  useEffect(() => {
    if (authTokens) {
      setUser(jwt_decode(authTokens.access));
    }
    setLoading(false);
  }, [authTokens, loading]);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        setAuthTokens,
        authTokens,
        registerUser,
        loginUser,
        logoutUser,
      }}
    >
      {loading ? null : children}
    </AuthContext.Provider>
  );
};
