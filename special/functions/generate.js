module.exports = {
  helpf: '(phrase)',
  desc: 'Generates subsequent text from the phrase inside the function.',
  func: async function (matches) {
    let poopy = this

    var word = matches[1]

    var resp = await poopy.modules.axios.request({
      url: 'https://api.ai21.com/studio/v1/j1-jumbo/complete',
      method: 'POST',
      data: {
          prompt: word,
          numResults: 1,
          maxTokens: 65,
          temperature: 0.6,
          topKReturn: 0,
          topP: 1,
          presencePenalty: {
              scale: 0,
              applyToNumbers: false,
              applyToPunctuations: false,
              applyToStopwords: false,
              applyToWhitespaces: false,
              applyToEmojis: false
          },
          countPenalty: {
              scale: 0,
              applyToNumbers: false,
              applyToPunctuations: false,
              applyToStopwords: false,
              applyToWhitespaces: false,
              applyToEmojis: false
          },
          frequencyPenalty: {
              scale: 0,
              applyToNumbers: false,
              applyToPunctuations: false,
              applyToStopwords: false,
              applyToWhitespaces: false,
              applyToEmojis: false
          },
          stopSequences: []
      },
      headers: {
          Authorization: `Bearer ${process.env.AI21KEY}`
      }
  }).catch(() => { })

    if (resp) {
      return `${word}${resp.data.completions[0].data.text}`
    }
    
    resp = await poopy.modules.deepai.callStandardApi("text-generator", {
      text: word,
    }).catch(() => { })

    if (resp) {
      return resp.output
    }

    return word
  },
  attemptvalue: 10,
  limit: 1,
  envRequired: ['AI21KEY', 'DEEPAIKEY']
}