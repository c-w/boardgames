import envalid from 'envalid';

export default envalid.cleanEnv(process.env, {
  STATE_DIR: envalid.str(),
  SERVER_PORT: envalid.port(),
});
