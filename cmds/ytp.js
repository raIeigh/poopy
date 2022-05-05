module.exports = {
    name: ['ytp'],
    execute: async function (msg, args) {
        let poopy = this

        msg.channel.sendTyping().catch(() => { })
        if (poopy.data['guild-data'][msg.guild.id]['channels'][msg.channel.id]['lastUrl'] === undefined && args[1] === undefined) {
            msg.channel.send('What is the file?!').catch(() => { })
            msg.channel.sendTyping().catch(() => { })
            return;
        };
        var filterslist = {
            video: [
                `[v]reverse[2v]`,
                `[v]negate[2v]`,
                `[v]negate,reverse[2v]`,
                `[v]fps=fps=vfps*2,setpts=0.5*PTS[2v]`,
                `[v]fps=fps=vfps/2,setpts=2*PTS[2v]`,
                `[v]hue=s=0[2v]`,
                `[v]hue=s=0,negate[2v]`,
                `[v]hue=s=-1[2v]`,
                `[v]hue=s=10[2v]`,
                `[v]hue=h=180[2v]`,
                `[v]hue=s=0,curves=r='0/0 1/rrgb':g='0/0 1/rrgb':b='0/0 1/rrgb'[2v]`,
                `[v]hflip[2v]`,
                `[v]vflip[2v]`,
                `[v]rotate=180*PI/180[2v]`,
                `[v]split[vstack][vstack2];[vstack][vstack2]vstack,split[vvstack][vvstack2];[vvstack][vvstack2]hstack,scale=iw/2:ih/2[2v]`,
                `[v]split[left][right];[left]hflip,hflip,crop=iw/2:ih:0:0[leftside];[right]hflip,crop=iw/2:ih:iw/2:0[rightside];[leftside][rightside]hstack[2v]`,
                `[v]split[left][right];[left]hflip,crop=iw/2:ih:0:0[leftside];[right]hflip,hflip,crop=iw/2:ih:iw/2:0[rightside];[leftside][rightside]hstack[2v]`,
                `[v]split[top][bottom];[top]vflip,vflip,crop=iw:ih/2:0:0[topside];[bottom]vflip,crop=iw:ih/2:0:ih/2[bottomside];[topside][bottomside]vstack[2v]`,
                `[v]split[top][bottom];[top]vflip,crop=iw:ih/2:0:0[topside];[bottom]vflip,vflip,crop=iw:ih/2:0:ih/2[bottomside];[topside][bottomside]vstack[2v]`
            ],

            audio: [
                `[a]areverse[2a]`,
                `[a]aresample=44100,asetrate=44100/2,aresample=44100,atempo=2[2a]`,
                `[a]aresample=44100,asetrate=44100*2,aresample=44100,atempo=0.5[2a]`,
                `[a]atempo=2[2a]`,
                `[a]atempo=0.5[2a]`,
                `[a]acrusher=.1:1:64:0:log[2a]`,
                `[a][1:a]afir=dry=10:wet=10[2a]`,
                `[a]aecho=1:1:1000:1[2a]`,
                `[a]aecho=1:1:1000:1,aecho=1:1:1000:1,aecho=1:1:1000:1,aecho=1:1:1000:1,aecho=1:1:1000:1,aecho=1:1:1000:1,aecho=1:1:1000:1,aecho=1:1:1000:1,aecho=1:1:1000:1,aecho=1:1:1000:1,aecho=1:1:1000:1,aecho=1:1:1000:1,aecho=1:1:1000:1,aecho=1:1:1000:1,aecho=1:1:1000:1[2a]`,
                `[a]aecho=1:1:1:1,aecho=1:1:1:1,aecho=1:1:1:1,aecho=1:1:1:1,aecho=1:1:1:1,aecho=1:1:1:1,aecho=1:1:1:1,aecho=1:1:1:1,aecho=1:1:1:1,aecho=1:1:1:1,aecho=1:1:1:1,aecho=1:1:1:1,aecho=1:1:1:1,aecho=1:1:1:1,aecho=1:1:1:1[2a]`
            ],
        }
        var clips = 10
        var clipsindex = args.indexOf('-clips')
        if (clipsindex > -1) {
            clips = isNaN(Number(args[clipsindex + 1])) ? 10 : Number(args[clipsindex + 1]) <= 1 ? 1 : Number(args[clipsindex + 1]) >= 200 ? 200 : Math.round(Number(args[clipsindex + 1])) || 10
        }
        var repetitions = 1
        var repindex = args.indexOf('-repetitions')
        if (repindex > -1) {
            repetitions = isNaN(Number(args[repindex + 1])) ? 1 : Number(args[repindex + 1]) <= 1 ? 1 : Number(args[repindex + 1]) >= 10 ? 10 : Math.round(Number(args[repindex + 1])) || 1
        }

        if (clips * repetitions > 250) {
            msg.channel.send('The number of clips must be smaller or equal to 250.')
            msg.channel.sendTyping().catch(() => { })
            return;
        }

        var currenturl = poopy.data['guild-data'][msg.guild.id]['channels'][msg.channel.id]['lastUrl'] || args[1]
        var fileinfo = await poopy.functions.validateFile(currenturl).catch(error => {
            msg.channel.send(error)
            msg.channel.sendTyping().catch(() => { })
            return;
        })

        if (!fileinfo) return
        var type = fileinfo.type

        if (type.mime.startsWith('video')) {
            var filepath = await poopy.functions.downloadFile(currenturl, `input.mp4`, {
                fileinfo: fileinfo
            })
            var filename = `input.mp4`
            poopy.modules.fs.mkdirSync(`${filepath}/clips`)
            var audio = fileinfo.info.audio

            if (audio) {
                var fps = fileinfo.info.fps
                var duration = Number(fileinfo.info.duration)

                var clipduration = duration / clips
                var clipsmade = 0
                var clipfiles = []

                var clipsmessage = await msg.channel.send(`Processing clip 0 out of ${clips * repetitions}.`).catch(() => { })

                for (var i = 1; i <= (clips * repetitions); i++) {
                    clipfiles.push(`file '${i}.mp4'`)
                }

                poopy.modules.fs.writeFileSync(`${filepath}/clips/list.txt`, args.indexOf('-norandomize') > -1 ? clipfiles.join('\n') : clipfiles.sort(() => {
                    return Math.random() - 0.5
                }).join('\n'))

                var clipeditinterval = setInterval(() => {
                    clipsmessage.edit(`Processing clip ${clipsmade + 1} out of ${clips * repetitions}.`).catch(() => { })
                }, 5000)

                for (var h = 0; h < repetitions; h++) {
                    for (var i = 0; i < clips; i++) {
                        var vid = 0
                        var audio = 0
                        var vidfilters = []
                        var audiofilters = []

                        for (var j = 0; j < Math.floor(Math.random() * 4); j++) {
                            var vidfilter = filterslist.video[Math.floor(Math.random() * filterslist.video.length)]
                                .replace(/vfps/g, fps)
                                .replace(/rrgb/g, Math.floor(Math.random() * 256) / 255)
                                .replace(/\[v\]/g, vid ? `[v${vid}]` : '[0:v]')
                                .replace(/\[2v\]/g, `[v${vid + 1}]`)

                            if (vidfilter.includes('[v]fps=fps=vfps*2,setpts=0.5*PTS[2v]'
                                .replace(/vfps/g, fps)
                                .replace(/rrgb/g, Math.floor(Math.random() * 256) / 255)
                                .replace(/\[v\]/g, vid ? `[v${vid}]` : '[0:v]')
                                .replace(/\[2v\]/g, `[v${vid + 1}]`))) {
                                var audiofilter = '[a]atempo=2[2a]'
                                    .replace(/\[a\]/g, audio ? `[a${audio}]` : '[0:a]')
                                    .replace(/\[2a\]/g, `[a${audio + 1}]`)

                                audiofilters.push(audiofilter)
                                audio++
                            }

                            if (vidfilter.includes('[v]fps=fps=vfps/2,setpts=2*PTS[2v]'
                                .replace(/vfps/g, fps)
                                .replace(/rrgb/g, Math.floor(Math.random() * 256) / 255)
                                .replace(/\[v\]/g, vid ? `[v${vid}]` : '[0:v]')
                                .replace(/\[2v\]/g, `[v${vid + 1}]`))) {
                                var audiofilter = '[a]atempo=0.5[2a]'
                                    .replace(/\[a\]/g, audio ? `[a${audio}]` : '[0:a]')
                                    .replace(/\[2a\]/g, `[a${audio + 1}]`)

                                audiofilters.push(audiofilter)
                                audio++
                            }

                            vidfilters.push(vidfilter)
                            vid += 1
                        }

                        for (var j = 0; j < Math.floor(Math.random() * 4); j++) {
                            var audiofilter = filterslist.audio[Math.floor(Math.random() * filterslist.audio.length)]
                                .replace(/\[a\]/g, audio ? `[a${audio}]` : '[0:a]')
                                .replace(/\[2a\]/g, `[a${audio + 1}]`)

                            if (audiofilter.includes('[a]atempo=2[2a]'
                                .replace(/\[a\]/g, audio ? `[a${audio}]` : '[0:a]')
                                .replace(/\[2a\]/g, `[a${audio + 1}]`))) {
                                var vidfilter = '[v]fps=fps=vfps*2,setpts=0.5*PTS[2v]'
                                    .replace(/vfps/g, fps)
                                    .replace(/rrgb/g, Math.floor(Math.random() * 256) / 255)
                                    .replace(/\[v\]/g, vid ? `[v${vid}]` : '[0:v]')
                                    .replace(/\[2v\]/g, `[v${vid + 1}]`)

                                vidfilters.push(vidfilter)
                                vid++
                            }

                            if (audiofilter.includes('[a]atempo=0.5[2a]'
                                .replace(/\[a\]/g, audio ? `[a${audio}]` : '[0:a]')
                                .replace(/\[2a\]/g, `[a${audio + 1}]`))) {
                                var vidfilter = '[v]fps=fps=vfps/2,setpts=2*PTS[2v]'
                                    .replace(/vfps/g, fps)
                                    .replace(/rrgb/g, Math.floor(Math.random() * 256) / 255)
                                    .replace(/\[v\]/g, vid ? `[v${vid}]` : '[0:v]')
                                    .replace(/\[2v\]/g, `[v${vid + 1}]`)

                                vidfilters.push(vidfilter)
                                vid++
                            }

                            audiofilters.push(audiofilter)
                            audio += 1
                        }

                        var vidfilter = vidfilters.join(';')
                        var audiofilter = audiofilters.join(';')

                        await poopy.functions.execPromise(`ffmpeg -i ${filepath}/${filename} ${audiofilter.includes('afir') ? '-i templates/church.mp3 ' : ''}-t ${clipduration} -ss ${clipduration * i} -filter_complex "${vidfilter}${vidfilter ? `;[v${vid}]` : '[0:v]'}scale=ceil(iw/2)*2:ceil(ih/2)*2[out]${audiofilter ? `;${audiofilter}` : ''}" -map "[out]" -map ${audiofilter ? `"[a${audio}]"` : '0:a'} -preset ${poopy.functions.findpreset(args)} -c:v libx264 -pix_fmt yuv420p ${filepath}/clips/${clipsmade + 1}.mp4`)

                        clipsmade++
                    }
                }

                clearInterval(clipeditinterval)
                clipsmessage.edit(`Concatenating clips.`).catch(() => { })

                await poopy.functions.execPromise(`ffmpeg -f concat -i ${filepath}/clips/list.txt -preset ${poopy.functions.findpreset(args)} -c:v libx264 -pix_fmt yuv420p ${filepath}/output.mp4`)
                clipsmessage.delete().catch(() => { })
                await poopy.functions.sendFile(msg, filepath, `output.mp4`)
            } else {
                var fps = fileinfo.info.fps
                var duration = Number(fileinfo.info.duration)

                var clipduration = duration / clips
                var clipsmade = 0
                var clipfiles = []

                var clipsmessage = await msg.channel.send(`Processing clip 0 out of ${clips * repetitions}.`).catch(() => { })

                for (var i = 1; i <= (clips * repetitions); i++) {
                    clipfiles.push(`file '${i}.mp4'`)
                }

                poopy.modules.fs.writeFileSync(`${filepath}/clips/list.txt`, args.indexOf('-norandomize') > -1 ? clipfiles.join('\n') : clipfiles.sort(() => {
                    return Math.random() - 0.5
                }).join('\n'))

                var clipeditinterval = setInterval(() => {
                    clipsmessage.edit(`Processing clip ${clipsmade + 1} out of ${clips * repetitions}.`).catch(() => { })
                }, 5000)

                for (var h = 0; h < repetitions; h++) {
                    for (var i = 0; i < clips; i++) {
                        var vid = 0
                        var vidfilters = []

                        for (var j = 0; j < Math.floor(Math.random() * 4); j++) {
                            var vidfilter = filterslist.video[Math.floor(Math.random() * filterslist.video.length)]
                                .replace(/vfps/g, fps)
                                .replace(/rrgb/g, Math.floor(Math.random() * 256) / 255)
                                .replace(/\[v\]/g, vid ? `[v${vid}]` : '[0:v]')
                                .replace(/\[2v\]/g, `[v${vid + 1}]`)

                            vidfilters.push(vidfilter)
                            vid += 1
                        }

                        var vidfilter = vidfilters.join(';')

                        await poopy.functions.execPromise(`ffmpeg -i ${filepath}/${filename} -t ${clipduration} -ss ${clipduration * i} -filter_complex "${vidfilter}${vidfilter ? `;[v${vid}]` : '[0:v]'}scale=ceil(iw/2)*2:ceil(ih/2)*2[out]" -map "[out]" -preset ${poopy.functions.findpreset(args)} -c:v libx264 -pix_fmt yuv420p ${filepath}/clips/${clipsmade + 1}.mp4`)

                        clipsmade++
                    }
                }

                clearInterval(clipeditinterval)
                clipsmessage.edit(`Concatenating clips.`).catch(() => { })

                await poopy.functions.execPromise(`ffmpeg -f concat -i ${filepath}/clips/list.txt -preset ${poopy.functions.findpreset(args)} -c:v libx264 -pix_fmt yuv420p ${filepath}/output.mp4`)
                clipsmessage.delete().catch(() => { })
                await poopy.functions.sendFile(msg, filepath, `output.mp4`)
            }
        } else if (type.mime.startsWith('image') && poopy.vars.gifFormats.find(f => f === type.ext)) {
            var filepath = await poopy.functions.downloadFile(currenturl, `input.gif`)
            var filename = `input.gif`
            poopy.modules.fs.mkdirSync(`${filepath}/clips`)

            var fps = fileinfo.info.fps
            var duration = Number(fileinfo.info.duration)

            var clipduration = duration / clips
            var clipsmade = 0
            var clipfiles = []

            var clipsmessage = await msg.channel.send(`Processing clip 0 out of ${clips * repetitions}.`).catch(() => { })

            for (var i = 1; i <= (clips * repetitions); i++) {
                clipfiles.push(`file '${i}.gif'`)
            }

            poopy.modules.fs.writeFileSync(`${filepath}/clips/list.txt`, args.indexOf('-norandomize') > -1 ? clipfiles.join('\n') : clipfiles.sort(() => {
                return Math.random() - 0.5
            }).join('\n'))

            var clipeditinterval = setInterval(() => {
                clipsmessage.edit(`Processing clip ${clipsmade + 1} out of ${clips * repetitions}.`).catch(() => { })
            }, 5000)

            for (var h = 0; h < repetitions; h++) {
                for (var i = 0; i < clips; i++) {
                    var vid = 0
                    var vidfilters = []

                    for (var j = 0; j < Math.floor(Math.random() * 4); j++) {
                        var vidfilter = filterslist.video[Math.floor(Math.random() * filterslist.video.length)]
                            .replace(/vfps/g, fps)
                            .replace(/rrgb/g, Math.floor(Math.random() * 256) / 255)
                            .replace(/\[v\]/g, vid ? `[v${vid}]` : '[0:v]')
                            .replace(/\[2v\]/g, `[v${vid + 1}]`)

                        vidfilters.push(vidfilter)
                        vid += 1
                    }

                    var vidfilter = vidfilters.join(';')

                    await poopy.functions.execPromise(`ffmpeg -i ${filepath}/${filename} -t ${clipduration} -ss ${clipduration * i} -filter_complex "${vidfilter}${vidfilter ? `;[v${vid}]` : '[0:v]'}split[pout][ppout];[ppout]palettegen=reserve_transparent=1[palette];[pout][palette]paletteuse=alpha_threshold=128[out]" -map "[out]" -preset ${poopy.functions.findpreset(args)} -gifflags -offsetting ${filepath}/clips/${clipsmade + 1}.gif`)

                    clipsmade++
                }
            }

            clearInterval(clipeditinterval)
            clipsmessage.edit(`Concatenating clips.`).catch(() => { })

            await poopy.functions.execPromise(`ffmpeg -f concat -i ${filepath}/clips/list.txt -filter_complex "[0:v]split[pout][ppout];[ppout]palettegen=reserve_transparent=1[palette];[pout][palette]paletteuse=alpha_threshold=128[out]" -map "[out]" -preset ${poopy.functions.findpreset(args)} -gifflags -offsetting ${filepath}/output.gif`)
            clipsmessage.delete().catch(() => { })
            await poopy.functions.sendFile(msg, filepath, `output.gif`)
        } else if (type.mime.startsWith('audio')) {
            var filepath = await poopy.functions.downloadFile(currenturl, `input.mp3`, {
                fileinfo: fileinfo
            })
            var filename = `input.mp3`
            poopy.modules.fs.mkdirSync(`${filepath}/clips`)
            var duration = Number(fileinfo.info.duration)

            var clipduration = duration / clips
            var clipsmade = 0
            var clipfiles = []

            var clipsmessage = await msg.channel.send(`Processing clip 0 out of ${clips * repetitions}.`).catch(() => { })

            for (var i = 1; i <= (clips * repetitions); i++) {
                clipfiles.push(`file '${i}.mp3'`)
            }

            poopy.modules.fs.writeFileSync(`${filepath}/clips/list.txt`, args.indexOf('-norandomize') > -1 ? clipfiles.join('\n') : clipfiles.sort(() => {
                return Math.random() - 0.5
            }).join('\n'))

            var clipeditinterval = setInterval(() => {
                clipsmessage.edit(`Processing clip ${clipsmade + 1} out of ${clips * repetitions}.`).catch(() => { })
            }, 5000)

            for (var h = 0; h < repetitions; h++) {
                for (var i = 0; i < clips; i++) {
                    var audio = 0
                    var audiofilters = []

                    for (var j = 0; j < Math.floor(Math.random() * 4); j++) {
                        var audiofilter = filterslist.audio[Math.floor(Math.random() * filterslist.audio.length)]
                            .replace(/\[a\]/g, audio ? `[a${audio}]` : '[0:a]')
                            .replace(/\[2a\]/g, `[a${audio + 1}]`)

                        audiofilters.push(audiofilter)
                        audio += 1
                    }

                    var audiofilter = audiofilters.join(';')

                    await poopy.functions.execPromise(`ffmpeg -i ${filepath}/${filename} ${audiofilter.includes('afir') ? '-i templates/church.mp3 ' : ''}-t ${clipduration} -ss ${clipduration * i} ${audiofilter ? `-filter_complex ${audiofilter} -map "[a${audio}]" ` : ''}-preset ${poopy.functions.findpreset(args)} ${filepath}/clips/${clipsmade + 1}.mp3`)

                    clipsmade++
                }
            }

            clearInterval(clipeditinterval)
            clipsmessage.edit(`Concatenating clips.`).catch(() => { })

            await poopy.functions.execPromise(`ffmpeg -f concat -i ${filepath}/clips/list.txt -preset ${poopy.functions.findpreset(args)} ${filepath}/output.mp3`)
            clipsmessage.delete().catch(() => { })
            await poopy.functions.sendFile(msg, filepath, `output.mp3`)
        } else {
            msg.channel.send({
                content: `Unsupported file: \`${currenturl}\``,
                allowedMentions: {
                    parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                }
            }).catch(() => { })
            msg.channel.sendTyping().catch(() => { })
            return
        }
    },
    help: {
        name: 'ytp <file> [-clips <number (max 200)>] [-repetitions <number (max 10)>] [-norandomize]',
        value: 'Turns the file into a YTP. Default clips is 10 and repetitions is 1.'
    },
    cooldown: 2500,
    type: 'Effects'
}