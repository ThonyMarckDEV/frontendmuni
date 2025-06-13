import React, { useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../js/urlHelper';
import jwtUtils from '../utilities/jwtUtils';
import FetchWithGif from '../components/Reutilizables/FetchWithGif';
import LoginForm from '../components/Auth/Login/LoginForm';
import ErrorsUtility from '../utilities/ErrorsUtility';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/login`, 
        { email, password, remember_me: rememberMe }, 
        { headers: { 'Content-Type': 'application/json' } }
      );

      const result = response.data;
      handleSuccessfulLogin(result, rememberMe);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessfulLogin = (result, useRememberMe) => {
    const { access_token, refresh_token, idRefreshToken } = result;

    const accessTokenExpiration = '; path=/; Secure; SameSite=Strict';
    const refreshTokenExpiration = useRememberMe
      ? `; expires=${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString()}; path=/; Secure; SameSite=Strict`
      : `; expires=${new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toUTCString()}; path=/; Secure; SameSite=Strict`;
    const refreshTokenIDExpiration = useRememberMe
      ? `; expires=${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString()}; path=/; Secure; SameSite=Strict`
      : `; expires=${new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toUTCString()}; path=/; Secure; SameSite=Strict`;

    document.cookie = `access_token=${access_token}${accessTokenExpiration}`;
    document.cookie = `refresh_token=${refresh_token}${refreshTokenExpiration}`;
    document.cookie = `refresh_token_id=${idRefreshToken}${refreshTokenIDExpiration}`;

    const rol = jwtUtils.getUserRole(access_token);

    if (rol === 'usuario') {
      toast.success('Login exitoso!!');
      setTimeout(() => navigate('/'), 1500);
    } else if (rol === 'admin') {
      toast.success('Login exitoso!!');
      setTimeout(() => navigate('/admin'), 1500);
    } else if (rol === 'tecnico') {
      setTimeout(() => navigate('/tecnico'), 1500);
       toast.success('Login exitoso!!');
    } else {
      console.error('Rol no reconocido:', rol);
      toast.error(`Rol no reconocido: ${rol}`);
    }
  };

  const handleError = (error) => {
    if (error.response) {
      const errorMessage = ErrorsUtility.getErrorMessage(error.response.data);
      toast.error(errorMessage);
    } else {
      console.error('Error al intentar iniciar sesión:', error);
      toast.error('Error interno del servidor. Por favor, inténtelo de nuevo más tarde.');
    }
  };

  return (
      <div className="min-h-screen w-full overflow-auto  flex items-center justify-center relative py-6">
        {loading && <FetchWithGif />}
        <LoginForm 
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          handleLogin={handleLogin}
          rememberMe={rememberMe}
          setRememberMe={setRememberMe}
        />
        <ToastContainer />
      </div>
  );
};

export default Login;