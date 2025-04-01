const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/hotel')
  .then(() => {
    console.log('MongoDB Conexión correcta.');
  })
  .catch(error => {
    console.log('Error in DB connection: ' + error);
  });

// Connect MongoDB at default port 27017.