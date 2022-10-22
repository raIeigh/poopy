module.exports = {
  name: ['clickhole'],
  args: [],
  execute: async function (msg) {
    let poopy = this
    let { axios, cheerio } = poopy.modules

    var res = await axios.request(`https://clickhole.com/category/news/`).catch(() => { })
    if (!res) return

    var $ = cheerio.load(res.data)
    var pages = Number($('.page-numbers')[3].children[0].data)
    var page = Math.floor(Math.random() * pages) + 1

    var res2 = await axios.request(`https://clickhole.com/category/news/${page != 1 ? `page/${page}/` : ''}`).catch(() => { })
    if (!res2) return

    var $2 = cheerio.load(res2.data)
    var posts = $2('.post')
    var post = posts[Math.floor(Math.random() * posts.length)]
    if (!msg.nosend) await msg.reply(post.children[1].children[1].children[0].attribs.href).catch(() => { })
    return post.children[1].children[1].children[0].attribs.href
  },
  help: {
    name: 'clickhole',
    value: "Sends one of Clickhole's AMAZENG NEWS!"
  },
  cooldown: 2500,
  type: 'Random'
}