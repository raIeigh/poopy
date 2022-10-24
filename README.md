# poopy
![Poopy](https://cdn.discordapp.com/attachments/760223418968047629/950177194158719066/0ab4fb95d50f0c0bf1751b6c7103f4ac.png)

Poopies for you.

```javascript
const Poopy = require('poopy')
let poopy = new Poopy({
    testing: true,
    keyLimit: 1500,
    globalPrefix: ':P'
})

poopy.start(process.env.TOKEN)
```

If you decide to host this bot, it needs to be in a Unix-like environment (basically linux)

You'll also need to install:
  - Node.JS
  - Python
  - Java
  - FFmpeg
  - ImageMagick

After everything's installed, run `build.sh`