require('dotenv').config();

module.exports = {
    apps: [
      {
        name: 'my-api',
        script: 'src/server.js',
        env_production: {
          NODE_ENV: 'production',
          PORT: process.env.PORT,
        },
      },
    ],
  };
  