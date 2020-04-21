import envalid from 'envalid';

export default envalid.cleanEnv(process.env, {
  STATE_DIR: envalid.str(),
  STATE_TTL: envalid.bool(),
  SERVER_PORT: envalid.port(),
  SECONDARY_PORT: envalid.num({ default: null }),
  HTTPS: envalid.bool({ default: false }),
  SSL_CRT_FILE: envalid.str({ default: '' }),
  SSL_KEY_FILE: envalid.str({ default: '' }),
});
