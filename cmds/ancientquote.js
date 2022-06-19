module.exports = {
    name: ['ancientquote'],
    execute: async function (msg, args) {
        let poopy = this

        await msg.channel.sendTyping().catch(() => { })
        var saidMessage = args.join(' ').substring(args[0].length + 1)
        if (args[1] === undefined) {
            await msg.channel.send('What is the text?!').catch(() => { })
            return
        }

        var waitMsg = await msg.channel.send(`Haha... This might take a century`).catch(() => { })

        var processInterval = setInterval(async () => {
            await msg.channel.sendTyping().catch(() => { })
        }, 5000)
        await msg.channel.sendTyping().catch(() => { })

        /*var intromakerresponse = await poopy.modules.axios.get('https://intromaker.com/', {
            headers: {
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36'
            }
        }).catch(async () => {
            await msg.channel.send('Error generating video.').catch(() => { })
        })

        if (!intromakerresponse) return

        var introeditorresponse = await poopy.modules.axios.get('https://intromaker.com/intro/408/ancient-quote/editor', {
            headers: {
                'cookie': intromakerresponse.headers['set-cookie'].map(cookie => cookie.split(';')[0]).join('; '),
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36'
            }
        }).catch(async () => {
            await msg.channel.send('Error generating video.').catch(() => { })
        })

        if (!introeditorresponse) return

        var $ = poopy.modules.cheerio.load(introeditorresponse.data)
        var editorScript = $('script#editor')[0]
        $ = poopy.modules.cheerio.load(editorScript.children[0].data)
        var token = $('input[name=_token]')[0].attribs.value

        var response = await poopy.functions.request({
            url: 'https://intromaker.com/render',
            method: 'POST',
            formData: {
                _token: token,
                templateId: 408,
                IC_EDIT_TEXTAREA_01: saidMessage,
                replaceAudio: 'original',
                libraryAudio: '30-seconds-of-christmas-dream_fy9FyBVd.mp3',
                uploadAudio: {
                    value: Buffer.from(''),
                    options: { filename: '', contentType: 'application/octet-stream' }
                }
            },
            headers: {
                'content-type': 'multipart/form-data; boundary=----WebKitFormBoundaryWp6DIODMVh0Uxxen',
                'cookie': intromakerresponse.headers['set-cookie'].map(cookie => cookie.split(';')[0]).join('; '),
                'origin': 'https://intromaker.com',
                'referer': 'https://intromaker.com/intro/408/ancient-quote',
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36'
            },
            followAllRedirects: true
        }).catch(async () => {
            await msg.channel.send('Error generating video.').catch(() => { })
        })

        if (!response) return

        console.log(response)*/

        var page = await poopy.vars.browser.newPage()
        await page.goto('https://intromaker.com/intro/408/ancient-quote')
        await poopy.functions.sleep(2000)
        await page.click('button#customizeIntro')
        await poopy.functions.sleep(2000)

        async function getRenderUrl() {
            var renderPageUrl = await page.evaluate((saidMessage) => {
                var form = new FormData()

                form.append('_token', $('input[name=_token]')[0].value)
                form.append('templateId', '408')
                form.append('IC_EDIT_TEXTAREA_01', saidMessage)
                form.append('replaceAudio', 'original')
                form.append('libraryAudio', '30-seconds-of-christmas-dream_fy9FyBVd.mp3')
                form.append('uploadAudio', new Blob([''], { type: 'application/octet-stream' }), '')

                var httpRequest = new XMLHttpRequest()

                httpRequest.open('POST', '/render', false)
                httpRequest.send(form)
                return httpRequest.responseURL
            }, saidMessage)
    
            await page.goto(renderPageUrl)

            return await page.evaluate(() => {
                return window.url
            })
        }

        var renderUrl = await getRenderUrl()
        page.close()

        async function finishRender() {
            var res = await poopy.modules.axios.get(renderUrl).catch(() => { })

            if (!res) {
                await poopy.functions.sleep(5000)
                return finishRender()
            }
        }

        await finishRender().catch(() => { })

        await waitMsg.delete().catch(() => { })
        clearInterval(processInterval)
        var filepath = await poopy.functions.downloadFile(renderUrl, `output.mp4`)
        return await poopy.functions.sendFile(msg, filepath, `output.mp4`)
    },
    help: {
        name: '<:newpoopy:839191885310066729> ancientquote <prompt>',
        value: 'very important!1!!! Try it yourself at https://intromaker.com/intro/408/ancient-quote'
    },
    cooldown: 2500,
    type: 'Generation'
}