module.exports = {
    name:['screenshot','savesite'],
    args:[{"name":"site","required":true,"specifarg":false,"orig":"<site>"}],
    execute: async function(msg, args) {
        let poopy = this;
        const fs = require('fs');
        const puppeteer = require('puppeteer');
        const path = require('path');
        let { sendFile } = poopy.functions;
        const site = args[1];
        const images_path = "./tempfiles";
        if (!fs.existsSync(images_path)) {
            fs.mkdirSync(images_path)
        }

        const browser = await puppeteer.launch()
        const page = await browser.newPage()
        
        await page.setViewport({
          width: 1280,
          height: 720,
          deviceScaleFactor: 0.7
        })
        
        await msg.channel.sendTyping().catch(() => { })

        let success = true;

        let blacklisted = ['porn','xvideos','gay', 'xxx', 'ipify'];

        if (blacklisted.find(element => site.toLowerCase().includes(element))) {
            msg.reply("No.");
            success = false;
        }

        await page.goto(site).catch(async (Error) => {
            await msg.reply("Invalid URL (or other error)!");
            console.error(Error);
            success = false;
        })

        if (!success){return};

        await page.screenshot({ path: `${images_path}/screenshit.png` })

        await browser.close()
        
        await sendFile(msg, images_path, 'screenshit.png');

        fs.unlinkSync(`${images_path}/screenshit.png`, (err) => {if (err) return err;});

        return;
    },
    help: {
        name: 'screenshot/savesite',
        value: 'Takes a screenshot of a website.'
    },
    cooldown: 3000,
    type: 'Fetching'
}