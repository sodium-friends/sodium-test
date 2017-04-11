var test = require('tape')
var alloc = require('buffer-alloc')

module.exports = function (sodium) {
  test('crypto_sign fixtures', function (assert) {
    var fixtures = require('./fixtures/crypto_sign.json')

    for (var i = 0; i < fixtures.length; i++) {
      var secretKey = new Buffer([].concat(fixtures[i][0], fixtures[i][1]))
      var publicKey = new Buffer(fixtures[i][1])
      var message = new Buffer(fixtures[i][3])

      var expected = new Buffer([].concat(fixtures[i][2], fixtures[i][3]))
      var actual = new Buffer(sodium.crypto_sign_BYTES + message.length)

      sodium.crypto_sign(actual, message, secretKey)

      if (expected.equals(actual) === false) {
        assert.fail('Failed on fixture #' + i)
        assert.end()
        return
      }
    }

    assert.pass('Passed all fixtures')
    assert.end()
  })
}
