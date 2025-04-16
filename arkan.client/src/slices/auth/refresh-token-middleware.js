import { logout } from '@services/auth/auth.service';

const isTokenExpired = (expiryDate) => {
  if (!expiryDate) {
    return true;
  }
  const now = new Date();
  return now > new Date(expiryDate);
};

export const refreshTokenMiddleware = (storeAPI) => (next) => async (action) => {
  if (!action || typeof action !== 'object' || Array.isArray(action) || action.type === undefined) {
    console.error('Invalid action:', action);
    return action; // Stop processing this action if it's invalid
  }

  if (action.type.includes('auth/logout')) {
    return next(action);
  }

  const state = storeAPI.getState();
  const { userToken, userInfo } = state.auth;

  if (userToken && isTokenExpired(userInfo?.refreshTokenExpiration) && !state.auth.loading) {
    console.log({ refreshTokenExpiration: userInfo.refreshTokenExpiration, type: action.type });
    storeAPI.dispatch(logout());
    return;
  }
  return next(action);
};
