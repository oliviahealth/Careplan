import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { useMutation } from 'react-query';
import axios from 'axios';

import Navbar from './Navbar';
import Footer from './Footer';
import { IUser, UserSchema } from '../utils/interfaces';
import useAppStore from '../store/useAppStore';
import { useEffect } from 'react';
import ErrorComponent from './ErrorComponent';
import SuccessComponent from './SuccessComponent';

const Layout = () => {
  const navigate = useNavigate();

  const user = useAppStore((state) => state.user);
  const accessToken = useAppStore((state) => state.access_token);

  const setUser = useAppStore((state) => state.setUser);
  const setAccessToken = useAppStore((state) => state.setAccessToken);

  const setError = useAppStore(state => state.setError);

  // Load the user from the session storage into the application state
  const { mutate: getUser } = useMutation(
    async (accessToken: string) => {
      const headers = {
        Authorization: 'Bearer ' + accessToken,
      };

      const user: IUser = (
        await axios.post(`${import.meta.env.VITE_API_URL}/get_user`, null, {
          headers: { ...headers },
          withCredentials: true,
        })
      ).data;

      UserSchema.parse(user);

      return { accessToken, user };
    },
    {
      onSuccess: ({ accessToken, user }) => {
        setAccessToken(accessToken);
        setUser(user);

        return navigate('/dashboard');
      },
      onError: () => {
        setError("Something went wrong! Please try again later")

        return navigate('/sign-in');
      },
    }
  );

  // If we have a user stored in session storage, load the user into the application state
  useEffect(() => {
    const fetchUser = async () => {
      const accessToken = sessionStorage.getItem('access_token');

      if (!accessToken) return;

      getUser(accessToken);
    };

    try {
      fetchUser();
    } catch (error) {
      setError("Something went wrong! Please try again later");
    }
  }, [getUser, setError]);

  return (
    <div className="flex flex-col justify-between h-[100vh]">
      <Navbar />

      <SuccessComponent />
      <ErrorComponent />

      {user && accessToken ? <Outlet /> : <Navigate to={'/sign-in'} />}
      <Footer />
    </div>
  );
};

export default Layout;
