module.exports = {
  desc: 'Returns a random Ronald McDonald GIF.',
  func: function () {
    let poopy = this

    var ronald = [
      'https://tenor.com/view/ronald-gif-20323112',
      'https://tenor.com/view/ronald-gif-20323104',
      'https://tenor.com/view/mc-donalds-smile-thumbs-down-gif-15614678',
      'https://tenor.com/view/mc-donalds-smile-wave-hi-hello-gif-15614675',
      'https://tenor.com/view/shocked-surprised-what-huh-ronald-mcdonald-gif-17825301',
      'https://tenor.com/view/mcdonalds-ronald-mcdonald-no-bad-gif-18753679',
      'https://tenor.com/view/mcdonalds-oh-yeah-happy-dance-peace-gif-15790119',
      'https://tenor.com/view/ronald-mcdonald-mcdonalds-excited-happy-yay-gif-16178752',
      'https://tenor.com/view/clown-mcdonalds-good-thumbs-up-nice-gif-16704087',
      'https://tenor.com/view/clown-mcdonald-ronald-mcdonald-laugh-lol-gif-18842655',
      'https://tenor.com/view/mcdonalds-ronald-mcdonald-clown-makeup-costume-gif-15607172',
      'https://tenor.com/view/mcdonalds-ronald-mcdonald-clown-makeup-costume-gif-15607167',
      'https://tenor.com/view/mcdonalds-ronald-mcdonald-clown-makeup-costume-gif-15607170',
      'https://tenor.com/view/clown-mcdonalds-wink-pointing-smile-gif-16021556',
      'https://tenor.com/view/airsoftfatty-mcdonalds-dancing-deepfake-dance-gif-19807516',
      'https://tenor.com/view/clown-mcdonalds-oh-wow-surprised-gif-16021560',
      'https://tenor.com/view/ronald-gif-21619925',
      'https://tenor.com/view/ronald-gif-21619963'
    ]

    return ronald[Math.floor(Math.random() * ronald.length)]
  }
}