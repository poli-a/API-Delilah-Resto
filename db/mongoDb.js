const mongoose = require('mongoose');

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}
try {
   mongoose.connect(process.env.MONGODB, options);
} catch (error) {
    console.log(error);
    throw err;
}

module.exports = {
    mongoose
}