const config = {
  REACT_APP_WAITING_FOR_PLAYER_REFRESH_MS: Number(process.env.REACT_APP_WAITING_FOR_PLAYER_REFRESH_MS) || 2000,
  REACT_APP_SERVER_URL: process.env.REACT_APP_SERVER_URL || window.location.origin,
};

export default config;
