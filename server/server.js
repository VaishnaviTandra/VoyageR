const exp = require('express');
const app = exp();
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');

const adminApp = require('./api/adminapi');
const guideApp = require('./api/guideapi');
const userApp = require('./api/userapi');

// Enable CORS
app.use(cors());

// ✅ Increase body size limit to handle large payloads (e.g., posting 300+ destinations)
app.use(exp.json({ limit: '5mb' }));
app.use(exp.urlencoded({ extended: true, limit: '5mb' }));

const port = process.env.PORT || 4000;

// Connect to MongoDB
mongoose.connect(process.env.DBURL)
  .then(() => {
    app.listen(port, () => console.log(`✅ Server listening on port ${port}...`));
    console.log("✅ DB connection success");
  })
  .catch(err => console.log("❌ Error in DB connection:", err));

// Mount API routes
app.use('/guide-api', guideApp);
app.use('/admin-api', adminApp);
app.use('/user-api', userApp);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Error object in Express error handler:', err);
  res.status(500).send({ message: err.message });
});
