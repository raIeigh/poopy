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

        var dataobjects = await schemas.data.find({
            dataid: databaseName
        }).catch((e) => console.log(e))

        console.log(dataobjects.length)

        if (dataobjects) {
            var dataobject = dataobjects[0]
            for (var k in dataobject) {
                var value = dataobject[k]
    
                if (k != 'dataid' && k != 'toString' && schemas.data.prototype.schema.obj[k]) {
                    data.data[k] = value
                }
            }
        }

        var globaldataobjects = await schemas.globaldata.find({}).catch((e) => console.log(e))

        console.log(globaldataobjects.length)

        if (globaldataobjects) {
            var globaldataobject = globaldataobjects[0]
            for (var k in globaldataobject) {
                var value = globaldataobject[k]
    
                if (k != 'dataid' && k != 'toString' && schemas.globaldata.prototype.schema.obj[k]) {
                    data.globaldata[k] = value
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

        await schemas.globaldata.findOneAndUpdate({}, globaldata, {
            upsert: true,
            useFindAndModify: false
        }).catch(() => { })

        requests--
        if (requests <= 0) mongoose.connection.close()
    }
}