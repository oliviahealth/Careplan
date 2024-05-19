import { Outlet } from "react-router-dom";
import useAppStore, { User, UserSchema } from "../store/useAppStore";
import axios from "axios";
import { useMutation } from "react-query";
import { useEffect, useState } from "react";

import Navbar from "./Navbar";
import Footer from "./Footer";
import { getCookie } from "../utils/cookie";

const Layout = () => {
  const setAccessToken = useAppStore((state) => state.setAccessToken);
  const setUser = useAppStore((state) => state.setUser);

  const [isLoading, setIsLoading] = useState(false);

  const { mutate: getUser } = useMutation(async (accessToken: string) => {
    const headers = {
      Authorization: "Bearer " + accessToken,
    };

    const user: User = (await axios.get(
      'http://127.0.0.1:5000/api/get_user',
      { headers: { ...headers } }
    )).data
    console.log(user)
    UserSchema.parse(user)

    return { accessToken, user };
  }, {
    onMutate: () => {
      setIsLoading(true);
    },
    onSuccess: ({ accessToken, user }) => {
      setAccessToken(accessToken);
      setUser(user);
      setIsLoading(false);
    },
    onError: () => {
      setIsLoading(false);
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      const access_token = getCookie('access_token');
      if (access_token) {
        getUser(access_token);
      }
    };
    fetchData();
  }, [getUser]);

  return (
    <div className="flex flex-col justify-between h-[100vh]">
      {isLoading ? (
        <div>
          {/* loading spinner or just put nothing */}
        </div>
      ) : (
        <>
          <Navbar />
          <Outlet />
          <Footer />
        </>
      )}
    </div>
  );
};

export default Layout;