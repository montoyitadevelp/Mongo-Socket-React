import { useCallback, useState, createContext, useEffect } from 'react';
import { baseUrl, postRequest } from '../utils/services';

export const AuthContext = createContext();

// eslint-disable-next-line react/prop-types
export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(false);
  const [isLoading, setIsloading] = useState(false);
  const [registerInfo, setRegisterInfo] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [errorLogin, setErrorLogin] = useState(null);
  const [isLoadingLogin, setLoadingLogin] = useState(false);
  const [loginInfo, setLoginInfo] = useState({
    email: '',
    password: '',
  });

  useEffect(() => {
    const user = localStorage.getItem('User');

    setUser(JSON.parse(user));
  }, []);

  const updatedRegisterInfo = useCallback((info) => {
    setRegisterInfo(info);
  }, []);

  const updatedLoginInfo = useCallback((info) => {
    setLoginInfo(info);
  }, []);

  const registerUser = useCallback(
    async (e) => {
      e.preventDefault();
      setIsloading(true);
      setError(null);

      const response = await postRequest(
        `${baseUrl}/users/register`,
        JSON.stringify(registerInfo)
      );

      setIsloading(false);

      if (response.error) {
        return setError(response);
      }
      localStorage.setItem('User', JSON.stringify(response));
      setUser(response);
    },
    [registerInfo]
  );

  const loginUser = useCallback(
    async (e) => {
      e.preventDefault();
      setErrorLogin(null);
      setLoadingLogin(true);

      const response = await postRequest(
        `${baseUrl}/users/login`,
        JSON.stringify(loginInfo)
      );

      setLoadingLogin(false);

      if (response.error) {
        return setErrorLogin(response);
      }

      localStorage.setItem('User', JSON.stringify(response));
      setUser(response);
    },
    [loginInfo]
  );

  const logout = useCallback(() => {
    localStorage.removeItem('User');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        registerInfo,
        updatedRegisterInfo,
        registerUser,
        error,
        isLoading,
        logout,
        errorLogin,
        isLoadingLogin,
        loginUser,
        updatedLoginInfo,
        loginInfo
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
