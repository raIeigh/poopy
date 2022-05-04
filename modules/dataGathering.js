const mongo = require('./mongo')
const schemas = require('./schemas')

module.exports = {
    getAllData: async (databaseName) => {
        var data = {
            data: {},
            globaldata: {}
        }
        var url = process.env.MONGOOSEURL
        const database = await mongo(url).catch(() => { })

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

        database.connection.close()

        return data
    },

    updateAllData: async (databaseName, d) => {
        var url = process.env.MONGOOSEURL
        const database = await mongo(url).catch(() => { })

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

        database.connection.close()
    }
}