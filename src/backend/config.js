import envalid from 'envalid';

export default envalid.cleanEnv(process.env, {
  STATE_DIR: envalid.str(),
  STATE_TTL: envalid.bool(),
  SERVER_PORT: envalid.port(),
});
