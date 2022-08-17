module.exports = {
  name: ['clickhole'],
  args: [],
  execute: async function (msg) {
    let poopy = this

    var res = await poopy.modules.axios.request(`https://clickhole.com/category/news/`).catch(() => { })
    if (!res) return

    var $ = poopy.modules.cheerio.load(res.data)
    var pages = Number($('.page-numbers')[3].children[0].data)
    var page = Math.floor(Math.random() * pages) + 1

    var res2 = await poopy.modules.axios.request(`https://clickhole.com/category/news/${page != 1 ? `page/${page}/` : ''}`).catch(() => { })
    if (!res2) return

    var $2 = poopy.modules.cheerio.load(res2.data)
    var posts = $2('.post')
    var post = posts[Math.floor(Math.random() * posts.length)]
    await msg.channel.send(post.children[1].children[1].children[0].attribs.href).catch(() => { })
  },
  help: {
    name: 'clickhole',
    value: "Sends one of Clickhole's AMAZENG NEWS!"
  },
  cooldown: 2500,
  type: 'Random'
}