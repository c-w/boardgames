import envalid from 'envalid';

export default envalid.cleanEnv(process.env, {
  REACT_APP_WAITING_FOR_PLAYER_REFRESH_MS: envalid.num({ default: 2000 }),
  REACT_APP_ROOM_LIST_REFRESH_MS: envalid.num({ default: 5000 }),
  REACT_APP_SERVER_URL: envalid.url(),
});
