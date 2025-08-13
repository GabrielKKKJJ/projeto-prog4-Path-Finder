// Entry point for the server
const app = require('./src/app');
const sequelize = require('./src/db');

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await sequelize.sync();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
})();
