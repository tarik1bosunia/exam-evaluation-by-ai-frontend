export const parseJwt = (token: string) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
};

export const isTokenExpired = (token: string) => {
  const decoded = parseJwt(token);
  if (!decoded?.exp) return true;
  
  const currentTime = Date.now() / 1000;
  return decoded.exp < currentTime;
};

export const getTokenExpiration = (token: string) => {
  const decoded = parseJwt(token);
  return decoded?.exp ? new Date(decoded.exp * 1000) : null;
};