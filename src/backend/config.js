import envalid from 'envalid';

export default envalid.cleanEnv(process.env, {
  STATE_DIR: envalid.str({ default: '' }),
  STATE_TTL: envalid.bool({ default: true }),
  AZURE_STORAGE_ACCOUNT: envalid.str({ default: '' }),
  AZURE_STORAGE_CONTAINER: envalid.str({ default: '' }),
  SOCKET_PER_MESSAGE_DEFLATE: envalid.bool({ default: true }),
  PORT: envalid.port(),
  SECONDARY_PORT: envalid.num({ default: undefined }),
  HTTPS: envalid.bool({ default: false }),
  SSL_CRT_FILE: envalid.str({ default: '' }),
  SSL_KEY_FILE: envalid.str({ default: '' }),
});
