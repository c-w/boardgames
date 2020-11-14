const config = {
  STATE_DIR: process.env.STATE_DIR || '',
  STATE_TTL: process.env.STATE_TTL !== 'false',
  AZURE_STORAGE_ACCOUNT: process.env.AZURE_STORAGE_ACCOUNT || '',
  AZURE_STORAGE_CONTAINER: process.env.AZURE_STORAGE_CONTAINER || '',
  SOCKET_PER_MESSAGE_DEFLATE: process.env.SOCKET_PER_MESSAGE_DEFLATE !== 'false',
  PORT: Number(process.env.PORT) || undefined,
  SECONDARY_PORT: Number(process.env.SECONDARY_PORT) || undefined,
  HTTPS: process.env.HTTPS === 'true',
  SSL_CRT_FILE: process.env.SSL_CRT_FILE || '',
  SSL_KEY_FILE: process.env.SSL_KEY_FILE || '',
  FRONTEND_ROOT: process.env.FRONTEND_ROOT || '',
};

if (!config.PORT) {
  throw new Error('No PORT provided');
}

export default config;
