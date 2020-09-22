var test = require('tape')
var fixtures = require('./fixtures/crypto_sign.json')

module.exports = function (sodium) {
  test('crypto_sign_open fixtures', function (assert) {
    for (var i = 0; i < fixtures.length; i++) {
      var publicKey = new Uint8Array(fixtures[i][1])
      var message = new Uint8Array(fixtures[i][3])
      var signed = new Uint8Array([].concat(fixtures[i][2], fixtures[i][3]))

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
      var secretKey = new Uint8Array([].concat(fixtures[i][0], fixtures[i][1]))
      var message = new Uint8Array(fixtures[i][3])

      var expected = new Uint8Array([].concat(fixtures[i][2], fixtures[i][3]))
      var actual = new Uint8Array(sodium.crypto_sign_BYTES + message.length)

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
      var publicKey = new Uint8Array(fixtures[i][1])
      var message = new Uint8Array(fixtures[i][3])
      var signature = new Uint8Array(fixtures[i][2])

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
      var secretKey = new Uint8Array([].concat(fixtures[i][0], fixtures[i][1]))
      var message = new Uint8Array(fixtures[i][3])

      var expected = new Uint8Array(fixtures[i][2])
      var actual = new Uint8Array(sodium.crypto_sign_BYTES)

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
    let sig = new Uint8Array(sodium.crypto_sign_BYTES)
    let sm = new Uint8Array(1024 + sodium.crypto_sign_BYTES)
    let skpk = new Uint8Array(sodium.crypto_sign_SECRETKEYBYTES)
    let pk = new Uint8Array(sodium.crypto_sign_PUBLICKEYBYTES)
    let sk = new Uint8Array(sodium.crypto_sign_SECRETKEYBYTES)
    let smlen
    let i
    let test

    sig.fill(0)

    var pass = true
    for (i = 0; i < fixtures.length; i++) {
      test = parseTest(fixtures[i])

      skpk.set(test.sk)
      skpk.set(test.pk, sodium.crypto_sign_SEEDBYTES)

      smlen = sodium.crypto_sign(sm.subarray(0, test.m.byteLength + sodium.crypto_sign_BYTES), test.m, skpk)
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

    hex2bin(pk, '3eee494fb9eac773144e34b0c755affaf33ea782c0722e5ea8b150e61209ab36')
    assert.notOk(sodium.crypto_sign_verify_detached(sig, test.m.subarray(0, i), pk))

    hex2bin(pk, '0200000000000000000000000000000000000000000000000000000000000000')
    assert.notOk(sodium.crypto_sign_verify_detached(sig, test.m.subarray(0, i), pk))

    hex2bin(pk, '0500000000000000000000000000000000000000000000000000000000000000')
    assert.notOk(sodium.crypto_sign_verify_detached(sig, test.m.subarray(0, i), pk))

    const keypair_seed = new Uint8Array([
      0x42, 0x11, 0x51, 0xa4, 0x59, 0xfa, 0xea, 0xde, 0x3d, 0x24, 0x71,
      0x15, 0xf9, 0x4a, 0xed, 0xae, 0x42, 0x31, 0x81, 0x24, 0x09, 0x5a,
      0xfa, 0xbe, 0x4d, 0x14, 0x51, 0xa5, 0x59, 0xfa, 0xed, 0xee
    ])

    assert.doesNotThrow(() => sodium.crypto_sign_seed_keypair(pk, sk, keypair_seed))
    assert.doesNotThrow(() => sodium.crypto_sign_keypair(pk, sk))

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

  test('ed25519 convert', (assert) => {
    const keypair_seed = new Uint8Array([
      0x42, 0x11, 0x51, 0xa4, 0x59, 0xfa, 0xea, 0xde, 0x3d, 0x24, 0x71,
      0x15, 0xf9, 0x4a, 0xed, 0xae, 0x42, 0x31, 0x81, 0x24, 0x09, 0x5a,
      0xfa, 0xbe, 0x4d, 0x14, 0x51, 0xa5, 0x59, 0xfa, 0xed, 0xee
    ])

    const ed25519_pk = new Uint8Array(sodium.crypto_sign_PUBLICKEYBYTES)
    const ed25519_skpk = new Uint8Array(sodium.crypto_sign_SECRETKEYBYTES)
    const curve25519_pk = new Uint8Array(sodium.crypto_scalarmult_BYTES)
    const curve25519_pk2 = new Uint8Array(sodium.crypto_scalarmult_BYTES)
    const curve25519_sk = new Uint8Array(sodium.crypto_scalarmult_BYTES)
    const curve25519_pk_hex = new Uint8Array(sodium.crypto_scalarmult_BYTES * 2 + 1)
    const curve25519_sk_hex = new Uint8Array(sodium.crypto_scalarmult_BYTES * 2 + 1)

    assert.ok(sodium.crypto_sign_SEEDBYTES <= sodium.crypto_hash_sha512_BYTES)

    sodium.crypto_sign_seed_keypair(ed25519_pk, ed25519_skpk, keypair_seed)
    sodium.crypto_sign_ed25519_pk_to_curve25519(curve25519_pk, ed25519_pk)
    sodium.crypto_sign_ed25519_sk_to_curve25519(curve25519_sk, ed25519_skpk)

    const expected_pk = new Uint8Array([
      0xf1, 0x81, 0x4f, 0x0e, 0x8f, 0xf1, 0x04, 0x3d, 0x8a, 0x44, 0xd2, 0x5b,
      0xab, 0xff, 0x3c, 0xed, 0xca, 0xe6, 0xc2, 0x2c, 0x3e, 0xda, 0xa4, 0x8f,
      0x85, 0x7a, 0xe7, 0x0d, 0xe2, 0xba, 0xae, 0x50
    ])

    const expected_sk = new Uint8Array([
      0x80, 0x52, 0x03, 0x03, 0x76, 0xd4, 0x71, 0x12, 0xbe, 0x7f, 0x73, 0xed,
      0x7a, 0x01, 0x92, 0x93, 0xdd, 0x12, 0xad, 0x91, 0x0b, 0x65, 0x44, 0x55,
      0x79, 0x8b, 0x46, 0x67, 0xd7, 0x3d, 0xe1, 0x66
    ])

    assert.deepEqual(curve25519_pk, expected_pk)
    assert.deepEqual(curve25519_sk, expected_sk)

    for (let i = 0; i < 500; i++) {
      sodium.crypto_sign_keypair(ed25519_pk, ed25519_skpk)
      sodium.crypto_sign_ed25519_pk_to_curve25519(curve25519_pk, ed25519_pk)

      sodium.crypto_sign_ed25519_sk_to_curve25519(curve25519_sk, ed25519_skpk)
      sodium.crypto_scalarmult_base(curve25519_pk2, curve25519_sk)
      if (Buffer.compare(curve25519_pk, curve25519_pk2) !== 0) assert.fail()
    }
    assert.pass('passed all cases')

    ed25519_pk.fill(0)
    assert.throws(() => {
      sodium.crypto_sign_ed25519_pk_to_curve25519(curve25519_pk, ed25519_pk)
    })

    assert.throws(() => {
      ed25519_pk[0] = 2
      sodium.crypto_sign_ed25519_pk_to_curve25519(curve25519_pk, ed25519_pk)
    })

    assert.throws(() => {
      ed25519_pk[0] = 5
      sodium.crypto_sign_ed25519_pk_to_curve25519(curve25519_pk, ed25519_pk)
    })

    assert.end()
  })
}

function parseTest (t) {
  return {
    sk: new Uint8Array(t[0]),
    pk: new Uint8Array(t[1]),
    sig: new Uint8Array(t[2]),
    m: new Uint8Array(t[3])
  }
}

function hex2bin (buf, hex) {
  for (let i = 0; i < hex.length / 2; i++) {
    buf[i] = Number('0x' + hex.slice(2 * i, 2 * i + 1))
  }
}
