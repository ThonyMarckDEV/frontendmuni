// jwtUtils.jsx

// Función para decodificar el payload de un JWT manualmente
const jwtDecode = (token) => {
  try {
    const base64Url = token.split('.')[1]; // Obtén la parte del payload
    if (!base64Url) throw new Error("Token inválido o incompleto");
    
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); // Normaliza el formato Base64Url
    const jsonPayload = atob(base64); // Decodifica Base64 a texto plano
    return JSON.parse(jsonPayload); // Convierte el texto en un objeto JSON
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

// Función para obtener el rol del usuario
export const getUserRole = (token) => jwtDecode(token)?.rol ?? null;

// Función para obtener el rol del usuario
export const getEmail= (token) => jwtDecode(token)?.email ?? null;

// Función para obtener el rol del usuario
export const getUserID = (token) => jwtDecode(token)?.sub ?? null;

// Función para obtener el id carrito del usuario
export const getIdCarrito = (token) => jwtDecode(token)?.idCarrito ?? null;

export const getNombres = (token) => jwtDecode(token)?.nombre ?? null;

export const getApellidos = (token) => jwtDecode(token)?.apellido ?? null;

// Función para obtener el google_user del usuario
export const getGoogle_User = (token) => jwtDecode(token)?.google_user ?? null;

// Función para obtener el email_verified del usuario
export const getEmail_Verified = (token) => jwtDecode(token)?.email_verified ?? null;

// // Función para verificar si el token está expirado
export const isTokenExpired = (token) => {
  const decodedToken = jwtDecode(token);
  if (decodedToken?.exp) {
    const currentTime = Date.now() / 1000; // Tiempo actual en segundos
    return decodedToken.exp < currentTime;
  }
  return true; // Si no hay exp, considera el token como expirado
};


// Función para obtener la fecha de expiración
export const getTokenExpirationDate = (token) => {
  const exp = jwtDecode(token)?.exp;
  return exp ? new Date(exp * 1000) : null;
};

// Función para verificar el token de manera general
export const verifyToken = (token) => {
  if (!token) {
    return { valid: false, message: "Token no proporcionado" };
  }
  
  if (isTokenExpired(token)) {
    return { valid: false, message: "Token expirado" };
  }
  
  return { valid: true, message: "Token válido" };
};

// Función para obtener el valor de una cookie por su nombre
const getCookie = (name) => {
  const cookieString = document.cookie;
  const cookies = cookieString.split(';').map(cookie => cookie.trim());

  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.split('=');
    if (cookieName === name) {
      return decodeURIComponent(cookieValue); // Decodifica el valor de la cookie
    }
  }

  return null; // Si no se encuentra la cookie, devuelve null
};

// // Función para obtener el token JWT de la cookie
export const getAccessTokenFromCookie = () => {
  const access_token = 'access_token'; // Nombre de la cookie donde se almacena el token
  return getCookie(access_token);
};

// // Función para obtener el token JWT de la cookie
export const getRefreshTokenFromCookie = () => {
  const refresh_token = 'refresh_token'; // Nombre de la cookie donde se almacena el token
  return getCookie(refresh_token);
};

// // Función para obtener el token JWT de la cookie
export const getRefreshTokenIDFromCookie = () => {
  const refresh_token_id = 'refresh_token_id'; // Nombre de la cookie donde se almacena el token
  return getCookie(refresh_token_id);
};



export const removeTokensFromCookie = () => {
  // Elimina el token de la cookie
  document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  document.cookie = 'refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  document.cookie = 'refresh_token_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
};




// New function to get the created at date
export const getCreatedAt = (token) => {
  try {
    const decodedToken = jwtDecode(token);
    return decodedToken?.createdAt 
      ? new Date(decodedToken.createdAt).toLocaleDateString('es', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }) 
      : "Usuario desde 2023";
  } catch (error) {
    console.error("Error decoding token for createdAt:", error);
    return "Usuario desde 2023";
  }
};

export const setAccessTokenInCookie = (token) => {
  if (!token) return;

  // Configurar opciones de cookies según "Recordarme"
  const cookieOptions = '; Path=/; Secure; SameSite=Strict';

  // Establecer la cookie con el token
  document.cookie = `access_token=${token}${cookieOptions}`;
};


export default {
  getUserRole,
  isTokenExpired,
  getTokenExpirationDate,
  verifyToken,
  removeTokensFromCookie,
  getEmail,
  getCreatedAt,
  getAccessTokenFromCookie,
  getRefreshTokenFromCookie,
  setAccessTokenInCookie,
  getUserID,
  getRefreshTokenIDFromCookie,
  getIdCarrito,
  getGoogle_User,
  getEmail_Verified,
  getNombres,
  getApellidos
};
