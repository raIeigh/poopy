const mongoose = require('mongoose')
const schemas = require('./schemas')
let requests = 0

module.exports = {
    getAllData: async (databaseName) => {
        var data = {
            data: {},
            globaldata: {}
        }

        var url = process.env.MONGOOSEURL
        if (requests <= 0) await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        requests++

        await schemas.data.find({
            dataid: databaseName
        }, (_, objects) => {
            var object = objects[0]

            for (var k in object) {
                var value = object[k]

                if (k != 'dataid' && k != 'toString' && schemas.data.prototype.schema.obj[k]) {
                    data.data[k] = value
                }
            }
        }).catch(() => { })

        await schemas.globaldata.find({}, (_, objects) => {
            var object = objects[0]

            for (var k in object) {
                var value = object[k]

                if (k != 'dataid' && k != 'toString' && schemas.globaldata.prototype.schema.obj[k]) {
                    data.globaldata[k] = value
                }
            }
        }).catch(() => { })

        requests--
        if (requests <= 0) mongoose.connection.close()

        return data
    },

    updateAllData: async (databaseName, d) => {
        var url = process.env.MONGOOSEURL
        if (requests <= 0) await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        requests++

        var data = d.data

        await schemas.data.findOneAndUpdate({
            dataid: databaseName
        }, data, {
            upsert: true,
            useFindAndModify: false
        }).catch(() => { })

        var globaldata = d.globaldata

        await schemas.globaldata.findOneAndUpdate({}, globaldata, {
            upsert: true,
            useFindAndModify: false
        }).catch(() => { })

        requests--
        if (requests <= 0) mongoose.connection.close()
    }
}