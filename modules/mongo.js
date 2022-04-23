var mongoose = require('mongoose')

module.exports = async (url) => {
    await mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    return mongoose
}