module.exports = {
    name: ['describeimage'],
    execute: async function (msg, args) {
        let poopy = this

        await msg.channel.sendTyping().catch(() => { })
        if (poopy.data['guild-data'][msg.guild.id]['channels'][msg.channel.id]['lastUrl'] === undefined && args[1] === undefined) {
            await msg.channel.send('What is the file to recognize?!').catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return;
        };
        var currenturl = poopy.data['guild-data'][msg.guild.id]['channels'][msg.channel.id]['lastUrl'] || args[1]
        var fileinfo = await poopy.functions.validateFile(currenturl).catch(async error => {
            await msg.channel.send(error).catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return;
        })

        if (!fileinfo) return
        var type = fileinfo.type

        if (type.mime.startsWith('image')) {
            var options = {
                url: 'https://hf.space/embed/Salesforce/BLIP/+/api/predict/',
                method: 'POST',
                data: { data: [`data:${type.mime};base64,${fileinfo.buffer.toString('base64')}`, "Image Captioning", "None", "Nucleus sampling"] },
                headers: { 'Content-Type': 'application/json' }
            }

            var response = await poopy.modules.axios.request(options).catch(async () => {
                await msg.channel.send('Error.').catch(() => { })
            })

            if (!response) return

            await msg.channel.send({
                content: response.data.data[0].replace('caption: ', ''),
                allowedMentions: {
                    parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                }
            }).catch(() => { })
        } else {
            await msg.channel.send({
                content: `Unsupported file: \`${currenturl}\``,
                allowedMentions: {
                    parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                }
            }).catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return
        }
    },
    help: {
        name: '<:newpoopy:839191885310066729> describeimage <image>',
        value: "Describes the contents of an image. Try it yourself at https://huggingface.co/spaces/OFA-Sys/OFA-Image_Caption"
    },
    cooldown: 2500,
    type: 'Text'
}