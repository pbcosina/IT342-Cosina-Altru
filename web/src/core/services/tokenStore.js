let accessToken = null;
let refreshToken = null;

export const getToken = () => accessToken;

export const setToken = (token) => {
    accessToken = token || null;
};

export const getRefreshToken = () => refreshToken;

export const setRefreshToken = (token) => {
    refreshToken = token || null;
};

export const clearTokens = () => {
    accessToken = null;
    refreshToken = null;
};
