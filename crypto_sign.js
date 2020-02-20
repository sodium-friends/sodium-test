var test = require('tape')

module.exports = function (sodium) {
  test('crypto_sign_open fixtures', function (assert) {
    var fixtures = require('./fixtures/crypto_sign.json')

    for (var i = 0; i < fixtures.length; i++) {
      var publicKey = Buffer.from(fixtures[i][1])
      var message = Buffer.from(fixtures[i][3])
      var signed = Buffer.from([].concat(fixtures[i][2], fixtures[i][3]))

      if (!sodium.crypto_sign_open(message, signed, publicKey)) {
        assert.fail('Failed on fixture #' + i)
        assert.end()
        return
      }
    }

    assert.pass('Passed all fixtures')
    assert.end()
  })

  test('crypto_sign fixtures', function (assert) {
    var fixtures = require('./fixtures/crypto_sign.json')

    for (var i = 0; i < fixtures.length; i++) {
      var secretKey = Buffer.from([].concat(fixtures[i][0], fixtures[i][1]))
      var message = Buffer.from(fixtures[i][3])

      var expected = Buffer.from([].concat(fixtures[i][2], fixtures[i][3]))
      var actual = Buffer.alloc(sodium.crypto_sign_BYTES + message.length)

      sodium.crypto_sign(actual, message, secretKey)

      if (equals(actual, expected) === false) {
        assert.fail('Failed on fixture #' + i)
        assert.end()
        return
      }
    }

    assert.pass('Passed all fixtures')
    assert.end()
  })

  test('crypto_sign_verify_detached fixtures', function (assert) {
    var fixtures = require('./fixtures/crypto_sign.json')

    for (var i = 0; i < fixtures.length; i++) {
      var publicKey = Buffer.from(fixtures[i][1])
      var message = Buffer.from(fixtures[i][3])
      var signature = Buffer.from(fixtures[i][2])

      if (!sodium.crypto_sign_verify_detached(signature, message, publicKey)) {
        assert.fail('Failed on fixture #' + i)
        assert.end()
        return
      }
    }

    assert.pass('Passed all fixtures')
    assert.end()
  })

  test('crypto_sign_detached fixtures', function (assert) {
    var fixtures = require('./fixtures/crypto_sign.json')

    for (var i = 0; i < fixtures.length; i++) {
      var secretKey = Buffer.from([].concat(fixtures[i][0], fixtures[i][1]))
      var message = Buffer.from(fixtures[i][3])

      var expected = Buffer.from(fixtures[i][2])
      var actual = Buffer.alloc(sodium.crypto_sign_BYTES)

      sodium.crypto_sign_detached(actual, message, secretKey)

      if (equals(actual, expected) === false) {
        assert.fail('Failed on fixture #' + i)
        assert.end()
        return
      }
    }

    assert.pass('Passed all fixtures')
    assert.end()
  })
}

function equals (buf1, buf2) {
  return Buffer.compare(buf1, buf2) === 0
}
