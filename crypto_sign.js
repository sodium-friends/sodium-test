var test = require('tape')
var fixtures = require('./fixtures/crypto_sign.json')

module.exports = function (sodium) {
  test('crypto_sign_open fixtures', function (assert) {
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

      if (Buffer.compare(actual, expected) !== 0) {
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

      if (Buffer.compare(actual, expected) !== 0) {
        assert.fail('Failed on fixture #' + i)
        assert.end()
        return
      }
    }

    assert.pass('Passed all fixtures')
    assert.end()
  })

  test('libsodium', assert => {
    let sig = Buffer.alloc(sodium.crypto_sign_BYTES)
    let sm = Buffer.alloc(1024 + sodium.crypto_sign_BYTES)
    let skpk = Buffer.alloc(sodium.crypto_sign_SECRETKEYBYTES)
    let pk = Buffer.alloc(sodium.crypto_sign_PUBLICKEYBYTES)
    let sk = Buffer.alloc(sodium.crypto_sign_SECRETKEYBYTES)
    let smlen
    let i
    let test

    sig.fill(0)

    var pass = true
    for (i = 0; i < fixtures.length; i++) {
      test = parseTest(fixtures[i])

      skpk.set(test.sk)
      skpk.set(test.pk, sodium.crypto_sign_SEEDBYTES)

      smlen = sodium.crypto_sign(sm, test.m, skpk)
      pass &= smlen === sodium.crypto_sign_BYTES + test.m.byteLength
      pass &= Buffer.compare(test.sig, sm.subarray(0, 64)) === 0
      pass &= sodium.crypto_sign_open(test.m, sm.subarray(0, smlen), test.pk)

      sodium.crypto_sign_detached(sig, test.m, skpk)

      pass &= sig.byteLength !== 0 && sig.byteLength <= sodium.crypto_sign_BYTES
      pass &= Buffer.compare(test.sig, sig) === 0
      pass &= sodium.crypto_sign_verify_detached(sig, test.m.subarray(0, i), test.pk)

      if (!pass) assert.fail('failed on fixture #' + i)
    }
    assert.pass('passed all fixtures')

    for (let j = 1; j < 8; j++) {
      sig[63] ^= (j << 5)

      assert.notOk(sodium.crypto_sign_verify_detached(sig, test.m.subarray(0, i), test.pk))

      sig[63] ^= (j << 5)
    }

    pk.fill(0)
    assert.notOk(sodium.crypto_sign_verify_detached(sig, test.m.subarray(0, i), pk))

    sig.subarray(0, 32).fill(0xff)
    sig[0] = 0xdb

    assert.notOk(sodium.crypto_sign_verify_detached(sig, test.m.subarray(0, i), pk))
    sodium.crypto_sign_detached(sig, test.m.subarray(0, i), skpk)

    pk.write('3eee494fb9eac773144e34b0c755affaf33ea782c0722e5ea8b150e61209ab36', 'hex')
    assert.notOk(sodium.crypto_sign_verify_detached(sig, test.m.subarray(0, i), pk))

    pk.write('0200000000000000000000000000000000000000000000000000000000000000', 'hex')
    assert.notOk(sodium.crypto_sign_verify_detached(sig, test.m.subarray(0, i), pk))

    pk.write('0500000000000000000000000000000000000000000000000000000000000000', 'hex')
    assert.notOk(sodium.crypto_sign_verify_detached(sig, test.m.subarray(0, i), pk))

    const keypair_seed = Buffer.from([
      0x42, 0x11, 0x51, 0xa4, 0x59, 0xfa, 0xea, 0xde, 0x3d, 0x24, 0x71,
      0x15, 0xf9, 0x4a, 0xed, 0xae, 0x42, 0x31, 0x81, 0x24, 0x09, 0x5a,
      0xfa, 0xbe, 0x4d, 0x14, 0x51, 0xa5, 0x59, 0xfa, 0xed, 0xee
    ])

    assert.equal(sodium.crypto_sign_seed_keypair(pk, sk, keypair_seed), 0)
    assert.equal(sodium.crypto_sign_keypair(pk, sk), 0)

    assert.assert(sodium.crypto_sign_BYTES > 0)
    assert.assert(sodium.crypto_sign_SEEDBYTES > 0)
    assert.assert(sodium.crypto_sign_PUBLICKEYBYTES > 0)
    assert.assert(sodium.crypto_sign_SECRETKEYBYTES > 0)
    assert.equal(sodium.crypto_sign_BYTES, 64)
    assert.equal(sodium.crypto_sign_SEEDBYTES, 32)
    assert.equal(sodium.crypto_sign_PUBLICKEYBYTES, 32)
    assert.equal(sodium.crypto_sign_SECRETKEYBYTES, 64)

    assert.end()
  })
}

function parseTest (t) {
  return {
    sk: Buffer.from(t[0]),
    pk: Buffer.from(t[1]),
    sig: Buffer.from(t[2]),
    m: Buffer.from(t[3])
  }
}
