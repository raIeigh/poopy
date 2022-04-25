module.exports = {
  desc: 'Returns a random known Phexonia Studios member.',
  func: async function () {
    let poopy = this

    var members = [
      "tenda",
      "another",
      "bubbley",
      "avery",
      "deinx",
      "bilon",
      "babis",
      "empsy",
      "gritzy",
      "ballfish",
      "meatwad",
      "tuca",
      "raleigh",
      "spooky",
      "spellbunny",
      "fnepp",
      "concern",
      "bartekoklol",
      "betteruser",
      "lead",
      "phexonia",
      "deinbag",
      "hiro",
      "superbrohouse",
      "sayori",
      "tree",
      "agnook",
      "ennakon",
      "gordano",
      "lad",
      "charleh",
      "maks",
      "zekkriel",
      "pl0x7",
      "wovxzers",
      "zeezy",
      "henryguy",
      "kleio",
      "diep",
      "welch",
      "alexandrfrol",
      "fizzy",
      "kurbee"
    ]
    return members[Math.floor(Math.random() * members.length)]
  }
}