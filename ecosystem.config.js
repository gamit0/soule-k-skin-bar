module.exports = {
  apps: [
    {
      name: "soule-k-skin-bar",
      // Node wrapper forces Windows console hidden via windowsHide:true.
      // We use a tiny script that spawns `next dev` with the flag and
      // inherits the hidden state across the whole process tree.
      script: "start-hidden.js",
      autorestart: true,
      max_restarts: 10,
      min_uptime: 5000,
      restart_delay: 3000,
      windowsHide: true,
      env: {
        NODE_ENV: "development",
      },
    },
  ],
};
