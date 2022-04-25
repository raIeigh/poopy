module.exports = {
  name: ['clickhole'],
  execute: async function (msg) {
    let poopy = this

    poopy.modules.axios.request(`https://clickhole.com/category/news/`).then((res) => {
      var $ = poopy.modules.cheerio.load(res.data)
      var pages = Number($('.page-numbers')[3].children[0].data)
      var page = Math.floor(Math.random() * pages) + 1
      poopy.modules.axios.request(`https://clickhole.com/category/news/${page != 1 ? `page/${page}/` : ''}`).then((res2) => {
        var $2 = poopy.modules.cheerio.load(res2.data)
        var posts = $2('.post')
        var post = posts[Math.floor(Math.random() * posts.length)]
        msg.channel.send(post.children[1].children[1].children[0].attribs.href).catch(() => { })
      }).catch(() => { })
    }).catch(() => { })
  },
  help: {
    name: 'clickhole',
    value: "Sends one of Clickhole's AMAZENG NEWS!"
  },
  cooldown: 2500,
  type: 'Random'
}