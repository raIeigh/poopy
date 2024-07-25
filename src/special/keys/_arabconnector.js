module.exports = {
  desc: "Returns a random connector from the arabottify command's connector dictionary.",
  func: function () {
    let poopy = this
    let json = poopy.json

    return json.arabJSON.conn[Math.floor(Math.random() * json.arabJSON.conn.length)]
  },
  array: function () {
    let poopy = this
    let json = poopy.json

    return json.arabJSON.conn
  }
}