const mongoose = require('mongoose')
const schemas = require('./schemas')
let requests = 0

module.exports = {
    getAllData: async (databaseName, global) => {
        var data = {
            data: {}
        }

        var url = process.env.MONGOOSEURL
        if (requests <= 0) await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        requests++

        var dataobjects = await schemas.data.find({ dataid: databaseName }).catch(() => { })

        if (dataobjects) {
            var dataobject = dataobjects[0]
            for (var k in dataobject) {
                var value = dataobject[k]
    
                if (k != 'dataid' && k != 'toString' && schemas.data.prototype.schema.obj[k]) {
                    data.data[k] = value
                }
            }
        }

        if (global) {
            data.globaldata = {}

            var globaldataobjects = await schemas.globaldata.find({}).catch(() => { })
    
            if (globaldataobjects) {
                var globaldataobject = globaldataobjects[0]
                for (var k in globaldataobject) {
                    var value = globaldataobject[k]
        
                    if (k != 'dataid' && k != 'toString' && schemas.globaldata.prototype.schema.obj[k]) {
                        data.globaldata[k] = value
                    }
                }
            }
        }

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

        if (globaldata) await schemas.globaldata.findOneAndUpdate({}, globaldata, {
            upsert: true,
            useFindAndModify: false
        }).catch(() => { })

        requests--
        if (requests <= 0) mongoose.connection.close()
    }
}