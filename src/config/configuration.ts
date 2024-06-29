export default () => ({
  apiPort: parseInt(process.env.PORT) || 3000,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  db: {
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  },

  username: {
    min: parseInt(process.env.USERNAME_MIN) || 3,
    max: parseInt(process.env.USERNAME_MAX) || 20,
  },

  password: {
    min: parseInt(process.env.PASSWORD_MIN) || 8,
    max: parseInt(process.env.PASSWORD_MAX) || 20,
    regex:
      RegExp(process.env.PASSWORD_REGEX) ||
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[@$!%*?&])[A-Za-zd@$!%*?&]+$/,
    hashSaltRounds: parseInt(process.env.HASH_SALT_ROUNDS) || 10,
  },

  smtp: {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT) || 587,
    tls: Boolean(process.env.SMTP_TLS) || true,
    user: process.env.SMTP_USER,
    password: process.env.SMTP_PASSWORD,
  },

  mail: {
    tokenLength: parseInt(process.env.MAIL_TOKEN_LENGTH_BYTES) || 8,
    tokenExpiresIn: parseInt(process.env.MAIL_TOKEN_EXPIRES_IN) || 15,
    from: process.env.MAIL_FROM,
  },

  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },

  clicksUpdateLimit: parseInt(process.env.CLICKS_UPDATE_LIMIT) || 600,

  cacheTTL: parseInt(process.env.CACHE_TTL) || 60,
});
