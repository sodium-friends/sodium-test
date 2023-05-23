const test = require('brittle')
const fixtures = require('./fixtures/crypto_sign.json')

module.exports = function (sodium) {
  test('crypto_sign_open fixtures', function (t) {
    for (let i = 0; i < fixtures.length; i++) {
      const publicKey = new Uint8Array(fixtures[i][1])
      const message = new Uint8Array(fixtures[i][3])
      const signed = new Uint8Array([].concat(fixtures[i][2], fixtures[i][3]))

      if (!sodium.crypto_sign_open(message, signed, publicKey)) {
        t.fail('Failed on fixture #' + i)
        return
      }
    }

    t.pass('Passed all fixtures')
  })

  test('crypto_sign fixtures', function (t) {
    const fixtures = require('./fixtures/crypto_sign.json')

    for (let i = 0; i < fixtures.length; i++) {
      const secretKey = new Uint8Array([].concat(fixtures[i][0], fixtures[i][1]))
      const message = new Uint8Array(fixtures[i][3])

      const expected = new Uint8Array([].concat(fixtures[i][2], fixtures[i][3]))
      const actual = new Uint8Array(sodium.crypto_sign_BYTES + message.length)

      sodium.crypto_sign(actual, message, secretKey)

      if (Buffer.compare(actual, expected) !== 0) {
        t.fail('Failed on fixture #' + i)
        return
      }
    }

    t.pass('Passed all fixtures')
  })

  test('crypto_sign_verify_detached fixtures', function (t) {
    const fixtures = require('./fixtures/crypto_sign.json')

    for (let i = 0; i < fixtures.length; i++) {
      const publicKey = new Uint8Array(fixtures[i][1])
      const message = new Uint8Array(fixtures[i][3])
      const signature = new Uint8Array(fixtures[i][2])

      if (!sodium.crypto_sign_verify_detached(signature, message, publicKey)) {
        t.fail('Failed on fixture #' + i)
        return
      }
    }

    t.pass('Passed all fixtures')
  })

  test('crypto_sign_detached fixtures', function (t) {
    const fixtures = require('./fixtures/crypto_sign.json')

    for (let i = 0; i < fixtures.length; i++) {
      const secretKey = new Uint8Array([].concat(fixtures[i][0], fixtures[i][1]))
      const message = new Uint8Array(fixtures[i][3])

      const expected = new Uint8Array(fixtures[i][2])
      const actual = new Uint8Array(sodium.crypto_sign_BYTES)

      sodium.crypto_sign_detached(actual, message, secretKey)

      if (Buffer.compare(actual, expected) !== 0) {
        t.fail('Failed on fixture #' + i)
        return
      }
    }

    t.pass('Passed all fixtures')
  })

  test.skip('libsodium', t => {
    const sig = new Uint8Array(sodium.crypto_sign_BYTES)
    const sm = new Uint8Array(1024 + sodium.crypto_sign_BYTES)
    const skpk = new Uint8Array(sodium.crypto_sign_SECRETKEYBYTES)
    const pk = new Uint8Array(sodium.crypto_sign_PUBLICKEYBYTES)
    const sk = new Uint8Array(sodium.crypto_sign_SECRETKEYBYTES)
    let smlen
    let i
    let test

    sig.fill(0)

    let pass = true
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

      if (!pass) t.fail('failed on fixture #' + i)
    }
    t.pass('passed all fixtures')

    for (let j = 1; j < 8; j++) {
      sig[63] ^= (j << 5)

      t.absent(sodium.crypto_sign_verify_detached(sig, test.m.subarray(0, i), test.pk))

      sig[63] ^= (j << 5)
    }

    pk.fill(0)
    t.absent(sodium.crypto_sign_verify_detached(sig, test.m.subarray(0, i), pk))

    sig.subarray(0, 32).fill(0xff)
    sig[0] = 0xdb

    t.absent(sodium.crypto_sign_verify_detached(sig, test.m.subarray(0, i), pk))
    sodium.crypto_sign_detached(sig, test.m.subarray(0, i), skpk)

    hex2bin(pk, '3eee494fb9eac773144e34b0c755affaf33ea782c0722e5ea8b150e61209ab36')
    t.absent(sodium.crypto_sign_verify_detached(sig, test.m.subarray(0, i), pk))

    hex2bin(pk, '0200000000000000000000000000000000000000000000000000000000000000')
    t.absent(sodium.crypto_sign_verify_detached(sig, test.m.subarray(0, i), pk))

    hex2bin(pk, '0500000000000000000000000000000000000000000000000000000000000000')
    t.absent(sodium.crypto_sign_verify_detached(sig, test.m.subarray(0, i), pk))

    const keypairseed = new Uint8Array([
      0x42, 0x11, 0x51, 0xa4, 0x59, 0xfa, 0xea, 0xde, 0x3d, 0x24, 0x71,
      0x15, 0xf9, 0x4a, 0xed, 0xae, 0x42, 0x31, 0x81, 0x24, 0x09, 0x5a,
      0xfa, 0xbe, 0x4d, 0x14, 0x51, 0xa5, 0x59, 0xfa, 0xed, 0xee
    ])

    t.execution(() => sodium.crypto_sign_seed_keypair(pk, sk, keypairseed))
    t.execution(() => sodium.crypto_sign_keypair(pk, sk))

    t.ok(sodium.crypto_sign_BYTES > 0)
    t.ok(sodium.crypto_sign_SEEDBYTES > 0)
    t.ok(sodium.crypto_sign_PUBLICKEYBYTES > 0)
    t.ok(sodium.crypto_sign_SECRETKEYBYTES > 0)
    t.equal(sodium.crypto_sign_BYTES, 64)
    t.equal(sodium.crypto_sign_SEEDBYTES, 32)
    t.equal(sodium.crypto_sign_PUBLICKEYBYTES, 32)
    t.equal(sodium.crypto_sign_SECRETKEYBYTES, 64)
  })

  test('ed25519 convert', (t) => {
    const keypairseed = new Uint8Array([
      0x42, 0x11, 0x51, 0xa4, 0x59, 0xfa, 0xea, 0xde, 0x3d, 0x24, 0x71,
      0x15, 0xf9, 0x4a, 0xed, 0xae, 0x42, 0x31, 0x81, 0x24, 0x09, 0x5a,
      0xfa, 0xbe, 0x4d, 0x14, 0x51, 0xa5, 0x59, 0xfa, 0xed, 0xee
    ])

    const ed25519pk = new Uint8Array(sodium.crypto_sign_PUBLICKEYBYTES)
    const ed25519skpk = new Uint8Array(sodium.crypto_sign_SECRETKEYBYTES)
    const curve25519pk = new Uint8Array(sodium.crypto_scalarmult_BYTES)
    const curve25519pk2 = new Uint8Array(sodium.crypto_scalarmult_BYTES)
    const curve25519sk = new Uint8Array(sodium.crypto_scalarmult_BYTES)

    t.ok(sodium.crypto_sign_SEEDBYTES <= sodium.crypto_hash_sha512_BYTES)

    sodium.crypto_sign_seed_keypair(ed25519pk, ed25519skpk, keypairseed)
    sodium.crypto_sign_ed25519_pk_to_curve25519(curve25519pk, ed25519pk)
    sodium.crypto_sign_ed25519_sk_to_curve25519(curve25519sk, ed25519skpk)

    const expectedpk = new Uint8Array([
      0xf1, 0x81, 0x4f, 0x0e, 0x8f, 0xf1, 0x04, 0x3d, 0x8a, 0x44, 0xd2, 0x5b,
      0xab, 0xff, 0x3c, 0xed, 0xca, 0xe6, 0xc2, 0x2c, 0x3e, 0xda, 0xa4, 0x8f,
      0x85, 0x7a, 0xe7, 0x0d, 0xe2, 0xba, 0xae, 0x50
    ])

    const expectedsk = new Uint8Array([
      0x80, 0x52, 0x03, 0x03, 0x76, 0xd4, 0x71, 0x12, 0xbe, 0x7f, 0x73, 0xed,
      0x7a, 0x01, 0x92, 0x93, 0xdd, 0x12, 0xad, 0x91, 0x0b, 0x65, 0x44, 0x55,
      0x79, 0x8b, 0x46, 0x67, 0xd7, 0x3d, 0xe1, 0x66
    ])

    t.alike(curve25519pk, expectedpk)
    t.alike(curve25519sk, expectedsk)

    for (let i = 0; i < 500; i++) {
      sodium.crypto_sign_keypair(ed25519pk, ed25519skpk)
      sodium.crypto_sign_ed25519_pk_to_curve25519(curve25519pk, ed25519pk)

      sodium.crypto_sign_ed25519_sk_to_curve25519(curve25519sk, ed25519skpk)
      sodium.crypto_scalarmult_base(curve25519pk2, curve25519sk)
      if (Buffer.compare(curve25519pk, curve25519pk2) !== 0) t.fail()
    }
    t.pass('passed all cases')

    ed25519pk.fill(0)
    t.exception.all(() => {
      sodium.crypto_sign_ed25519_pk_to_curve25519(curve25519pk, ed25519pk)
    })

    t.exception.all(() => {
      ed25519pk[0] = 2
      sodium.crypto_sign_ed25519_pk_to_curve25519(curve25519pk, ed25519pk)
    })

    t.exception.all(() => {
      ed25519pk[0] = 5
      sodium.crypto_sign_ed25519_pk_to_curve25519(curve25519pk, ed25519pk)
    })
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
