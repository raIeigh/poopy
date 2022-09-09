const fs = require('fs')

let dataValues = {}

dataValues.statuses = JSON.parse(fs.readFileSync('./src/json/statuses.json'))
dataValues.arrays = {
    arabDictionary: JSON.parse(fs.readFileSync('./src/json/arab.json')).words,
    arabDanger: JSON.parse(fs.readFileSync('./src/json/arab.json')).danger,
    arabConnectors: JSON.parse(fs.readFileSync('./src/json/arab.json')).connectors,
    psFiles: JSON.parse(fs.readFileSync('./src/json/psfiles.json')),
    psPasta: JSON.parse(fs.readFileSync('./src/json/pspasta.json')),
    funnygifs: JSON.parse(fs.readFileSync('./src/json/funnygif.json')),
    poopPhrases: JSON.parse(fs.readFileSync('./src/json/poop.json')),
    dmPhrases: JSON.parse(fs.readFileSync('./src/json/dmphrases.json')),
    eightball: [
        'I don\'t know.', 'Maybe...', 'I think so.', 'Of course.', 'I don\'t think so.',
        'I can afirm.', 'No, that\'s wrong.', 'Yes, that\'s right.', 'I assume so.', 'Yes.',
        'No.', 'I have no answers.', 'That\'s true.', 'That\'s false.', 'Isn\'t it obvious?'
    ]
}
dataValues.globaldata = {}
dataValues.activeBots = []

module.exports = dataValues