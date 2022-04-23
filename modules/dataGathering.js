const mongo = require('./mongo')
const dataschema = require('./schema')
const schemas = require('./schemas')

module.exports = {
    getAllData: async (databaseName, old) => {
        var data = {}
        var url = process.env.MONGOOSEURL
        const database = await mongo(url).catch(() => { })

        if (old) {
            for (var i in schemas) {
                var schema = schemas[i]
                data[i] = {}

                await schema.find({}, (_, objects) => {
                    for (var j in objects) {
                        var object = objects[j]
                        data[i][object.dataid] = {}

                        for (var k in object) {
                            var value = object[k]

                            if (k != 'dataid' && k != 'toString' && schema.prototype.schema.obj[k]) {
                                data[i][object.dataid][k] = value
                            }
                        }
                    }
                }).catch(() => { })
            }
        } else {
            await dataschema.find({
                dataid: databaseName
            }, (_, objects) => {
                var object = objects[0]

                for (var k in object) {
                    var value = object[k]

                    if (k != 'dataid' && k != 'toString' && dataschema.prototype.schema.obj[k]) {
                        data[k] = value
                    }
                }
            }).catch(() => { })
        }

        database.connection.close()

        return data
    },

    updateAllData: async (databaseName, data, old) => {
        var url = process.env.MONGOOSEURL
        const database = await mongo(url).catch(() => { })

        if (old) {
            for (var i in data) {
                var dataType = data[i]
                var schema = schemas[i]

                for (var j in dataType) {
                    var dataObject = dataType[j]

                    await schema.findOneAndUpdate({
                        dataid: j
                    }, dataObject, {
                        upsert: true,
                        useFindAndModify: false
                    }).catch(() => { })
                }
            }
        } else {
            await dataschema.findOneAndUpdate({
                dataid: databaseName
            }, data, {
                upsert: true,
                useFindAndModify: false
            }).catch(() => { })

            database.connection.close()
        }
    }
}