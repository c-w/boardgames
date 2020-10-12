import envalid from 'envalid';

export default envalid.cleanEnv(process.env, {
  REACT_APP_WAITING_FOR_PLAYER_REFRESH_MS: envalid.num({ default: 2000 }),
  REACT_APP_SERVER_URL: envalid.url({ default: window.location.origin }),
});
