import React, { useState } from 'react';
import { User, Lock, LogIn } from 'lucide-react';
import img from '../../../img/logo/munipiuralogo.png';

const LoginForm = ({ email, setEmail, password, setPassword, handleLogin, handleGoogleLogin, loading, rememberMe, setRememberMe}) => {
  return (
    <div className="flex bg-white rounded-2xl shadow-2xl overflow-hidden max-w-4xl w-full">
      {/* Panel Izquierdo - Bienvenida */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-500 to-blue-600 p-12 flex-col justify-center items-center text-white relative">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-6">¡Bienvenido(a)!</h1>
          
          {/* Imagen en lugar del logo y texto */}
          <div className="bg-white rounded-full p-8 mb-8 shadow-lg">
            <img src={img} alt="MelyMarckStore Logo" className="h-24 w-auto mx-auto" />
          </div>
          
          <h2 className="text-2xl font-semibold mb-4">Sistema de Gestión de Incidentes</h2>
          
          <div className="text-sm">
            Contacto: <span className="font-semibold">soporte@munipiuragob.pe</span>
          </div>
        </div>
      </div>

      {/* Panel Derecho - Formulario */}
      <div className="w-full md:w-1/2 p-12 flex flex-col justify-center">
        <div className="max-w-sm mx-auto w-full">
          {/* Header móvil */}
          <div className="md:hidden text-center mb-8">
            <img src="./img/logo.png" alt="MelyMarckStore Logo" className="h-12 w-auto mx-auto mb-4" />
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Municipalidad de Piura</h2>
            <p className="text-gray-600">Inicia sesión para continuar</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                USUARIO
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200"
                  placeholder="tu@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ESCRIBE TU CONTRASEÑA
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200"
                  placeholder="••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Recordarme (7 días)
                </label>
              </div>
            </div>

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Cargando...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-5 w-5" />
                  Acceder
                </>
              )}
            </button>
          </div>

          {/* Información adicional */}
          <div className="mt-6 space-y-3">
            <div className="text-center text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
              {rememberMe
                ? 'La sesión durará 7 días al marcar "Recordarme".'
                : 'La sesión dura 1 día por defecto. Marca "Recordarme" para 7 días.'}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LoginForm;