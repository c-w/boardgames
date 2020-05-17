import envalid from 'envalid';

export default envalid.cleanEnv(process.env, {
  STATE_DIR: envalid.str({ default: '' }),
  STATE_TTL: envalid.bool({ default: true }),
  AZURE_STORAGE_ACCOUNT: envalid.str({ default: '' }),
  PORT: envalid.port(),
  SECONDARY_PORT: envalid.num({ default: null }),
  HTTPS: envalid.bool({ default: false }),
  SSL_CRT_FILE: envalid.str({ default: '' }),
  SSL_KEY_FILE: envalid.str({ default: '' }),
});
