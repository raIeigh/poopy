const mongoose = require('mongoose')
const schemas = require('./schemas')
let requests = 0

module.exports = {
    globalData: async () => {
        var globalData = {}

        var url = process.env.MONGOOSE_URL
        if (requests <= 0) await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        requests++

        var globaldataobjects = await schemas.globalData.find({}).catch(() => { })

        if (globaldataobjects) {
            var globaldataobject = globaldataobjects[0]
            for (var k in globaldataobject) {
                var value = globaldataobject[k]

                if (k != 'dataid' && schemas.globalData.prototype.schema.obj[k]) {
                    globalData[k] = value
                }
            }
        }

        requests--
        if (requests <= 0) mongoose.connection.close()

        return globalData
    },

    allData: async (dataid, global) => {
        var data = {
            data: {}
        }

        var url = process.env.MONGOOSE_URL
        if (requests <= 0) await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        requests++

        var dataobjects = await schemas.data.find({ dataid }).catch(() => { })

        if (dataobjects) {
            var dataobject = dataobjects[0]
            for (var k in dataobject) {
                var value = dataobject[k]

                if (k != 'dataid' && schemas.data.prototype.schema.obj[k]) {
                    data.data[k] = value
                }
            }
        }

        if (global) {
            data.globaldata = {}

            var globaldataobjects = await schemas.globalData.find({}).catch(() => { })

            if (globaldataobjects) {
                var globaldataobject = globaldataobjects[0]
                for (var k in globaldataobject) {
                    var value = globaldataobject[k]

                    if (k != 'dataid' && schemas.globalData.prototype.schema.obj[k]) {
                        data.globaldata[k] = value
                    }
                }
            }
        }

        requests--
        if (requests <= 0) mongoose.connection.close()

        return data
    },

    update: async (dataid, { ...d }) => {
        var url = process.env.MONGOOSE_URL
        if (requests <= 0) await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        requests++

        var data = d.data

        var botData = data.botData
        await schemas.botData.findOneAndUpdate({ dataid }, botData, {
            upsert: true,
            useFindAndModify: false
        }).catch(() => { })

        var userData = data.userData
        for (var uid in userData) {
            var user = userData[uid]
            await schemas.userData.findOneAndUpdate({ dataid, uid }, user, {
                upsert: true,
                useFindAndModify: false
            }).catch(() => { })
        }

        var guildData = data.guildData
        for (var gid in guildData) {
            var guild = guildData[gid]

            var channelData = guild.channels
            delete guild.channels
            for (var cid in channelData) {
                var channel = channelData[cid]
                await schemas.channelData.findOneAndUpdate({ dataid, cid, gid }, channel, {
                    upsert: true,
                    useFindAndModify: false
                }).catch(() => { })
            }

            var memberData = guild.members
            delete guild.members
            for (var uid in memberData) {
                var member = memberData[uid]
                await schemas.memberData.findOneAndUpdate({ dataid, uid, gid }, member, {
                    upsert: true,
                    useFindAndModify: false
                }).catch(() => { })
            }

            await schemas.guildData.findOneAndUpdate({ dataid, gid }, guild, {
                upsert: true,
                useFindAndModify: false
            }).catch(() => { })
        }

        var globaldata = d.globaldata

        if (globaldata) await schemas.globalData.findOneAndUpdate({}, globaldata, {
            upsert: true,
            useFindAndModify: false
        }).catch(() => { })

        requests--
        if (requests <= 0) mongoose.connection.close()
    }
}