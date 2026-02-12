/**
 * PM2 ecosystem file for running the bot on a Linux server.
 * NOTE: update `cwd` if you deploy to a different path, or remove it to use the
 * current working directory.
 */
module.exports = {
  apps: [
    {
      name: 'custardbot',
      script: './dist/index.js', // run the compiled JS
      cwd: process.cwd(), // change if you deploy elsewhere
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '300M',
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};
