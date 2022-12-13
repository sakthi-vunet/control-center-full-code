import { useContext } from 'react';

import axios from 'axios';
import dayjs from 'dayjs';
import jwt_decode from 'jwt-decode';

import url_backend from '../configs/url';
import { AuthContext } from '../context/AuthContext';

// We are accessing authTokens, setUser, setAuthTokens from useContext.
// We need them to get and change state of the React app.
// Furthermore, we are creating an axiosinstance having authentication headers assuring it to be only used on private routes.
// Then we are decoding the user access token. Token is having exp date telling when it will expire. On the next line,
//  we are just checking whether that token in valid or not.
//  If expired, get new access token & change state of application.

const baseURL = url_backend + '/api/auth';

const useAxios = () => {
  const { authTokens, setUser, setAuthTokens } = useContext(AuthContext);

  const axiosInstance = axios.create({
    baseURL,
    headers: { Authorization: `Bearer ${authTokens?.access}` },
  });

  axiosInstance.interceptors.request.use(async (req) => {
    const user = jwt_decode(authTokens.access) as any;
    const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;

    if (!isExpired) return req;

    const response = await axios.post(`${baseURL}/token/refresh/`, {
      refresh: authTokens.refresh,
    });

    localStorage.setItem('authTokens', JSON.stringify(response.data));

    setAuthTokens(response.data);
    setUser(jwt_decode(response.data.access));

    req.headers!['Authorization '] = `Bearer ${response.data.access}`;
    return req;
  });

  return axiosInstance;
};

export default useAxios;
