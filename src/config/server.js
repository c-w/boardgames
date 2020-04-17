import envalid from 'envalid';

export default envalid.cleanEnv(process.env, {
  PORT: envalid.port(),
});
